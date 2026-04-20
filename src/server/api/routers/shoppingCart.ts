import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getWithKey, saveWithKey } from "~/keystore";
import { stripe } from "~/server/stripe";

export const cartItemSchema = z.object({
  eventId: z.string(),
  optionId: z.string(),
  name: z.string(),
  optionName: z.string(),
  price: z.number(),
  image: z.string(),
});

export type CartItem = z.infer<typeof cartItemSchema>;

export const shoppingCartRouter = createTRPCRouter({
  addToCart: protectedProcedure
    .input(cartItemSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const cartKey = `cart_${userId}`;
      
      // Get existing cart
      const existingCart = (await getWithKey("shoppingCarts", cartKey)) as { items: CartItem[] } | null;
      const items = existingCart?.items ?? [];
      
      // Check for duplicate
      const isDuplicate = items.some(
        (item) => item.eventId === input.eventId && item.optionId === input.optionId
      );

      if (!isDuplicate) {
        items.push(input);
        // Save updated cart
        await saveWithKey("shoppingCarts", cartKey, { items });
      }
      
      return { success: true, itemCount: items.length };
    }),

  getCart: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const cartKey = `cart_${userId}`;
    const cart = (await getWithKey("shoppingCarts", cartKey)) as { items: CartItem[] } | null;
    return cart?.items ?? [];
  }),

  removeFromCart: protectedProcedure
    .input(z.object({ eventId: z.string(), optionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const cartKey = `cart_${userId}`;
      
      const existingCart = (await getWithKey("shoppingCarts", cartKey)) as { items: CartItem[] } | null;
      if (!existingCart) return { success: true };

      const items = existingCart.items.filter(
        (item) => !(item.eventId === input.eventId && item.optionId === input.optionId)
      );
      
      await saveWithKey("shoppingCarts", cartKey, { items });
      
      return { success: true, itemCount: items.length };
    }),

  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const cartKey = `cart_${userId}`;
    await saveWithKey("shoppingCarts", cartKey, { items: [] });
    return { success: true };
  }),

  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const userEmail = ctx.session.user.email;
    const cartKey = `cart_${userId}`;
    
    const cart = (await getWithKey("shoppingCarts", cartKey)) as { items: CartItem[] } | null;
    const items = cart?.items ?? [];

    if (items.length === 0) {
      throw new Error("Cart is empty");
    }

    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const host = ctx.headers.get("host") ?? "localhost:3000";
    const baseUrl = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${item.name} - ${item.optionName}`,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: 1,
      })),
      mode: "payment",
      success_url: `${baseUrl}/shoppingCart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shoppingCart`,
      customer_email: userEmail,
      metadata: {
        userId,
      },
    });

    return { url: session.url };
  }),
});
