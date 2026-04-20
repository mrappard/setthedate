import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getWithKey, saveWithKey } from "~/keystore";
import { stripe } from "~/server/stripe";
import { TRPCError } from "@trpc/server";

export const bookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  items: z.array(z.object({
    eventId: z.string(),
    optionId: z.string(),
    name: z.string(),
    optionName: z.string(),
    price: z.number(),
    image: z.string(),
  })),
  total: z.number(),
  stripeSessionId: z.string(),
  createdAt: z.string(),
  status: z.string(),
});

export type Booking = z.infer<typeof bookingSchema>;

export const bookingsRouter = createTRPCRouter({
  getMyBookings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userBookingsKey = `bookings_${userId}`;
    const data = await getWithKey("userBookings", userBookingsKey) as { bookings: Booking[] } | null;
    return data?.bookings ?? [];
  }),

  finalizeCheckout: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // 1. Retrieve session from Stripe
      const session = await stripe.checkout.sessions.retrieve(input.sessionId);
      
      if (session.payment_status !== "paid") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Payment not completed",
        });
      }

      // 2. Check if this booking already exists to prevent duplicates on refresh
      const userBookingsKey = `bookings_${userId}`;
      const existingData = await getWithKey("userBookings", userBookingsKey) as { bookings: Booking[] } | null;
      const bookings = existingData?.bookings ?? [];
      
      if (bookings.some(b => b.stripeSessionId === input.sessionId)) {
        return { success: true, alreadyProcessed: true };
      }

      // 3. Get items from metadata (we'll update createCheckoutSession to include this)
      // or from the cart if metadata is missing (fallback)
      const cartKey = `cart_${userId}`;
      const cart = await getWithKey("shoppingCarts", cartKey) as { items: any[] } | null;
      const items = cart?.items ?? [];

      if (items.length === 0) {
        // If cart is empty, maybe they refreshed and we already cleared it but didn't save the booking?
        // In a real app we'd fetch line_items from Stripe
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No items found to book",
        });
      }

      const newBooking: Booking = {
        id: `book_${Date.now()}`,
        userId,
        items,
        total: session.amount_total ? session.amount_total / 100 : 0,
        stripeSessionId: input.sessionId,
        createdAt: new Date().toISOString(),
        status: "confirmed",
      };

      bookings.push(newBooking);

      // 4. Save booking
      await saveWithKey("userBookings", userBookingsKey, { bookings });

      // 5. Clear cart
      await saveWithKey("shoppingCarts", cartKey, { items: [] });

      return { success: true };
    }),
});
