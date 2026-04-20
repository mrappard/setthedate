import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getAllDocsInCollection, getWithKey } from "~/keystore";

export const eventOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  description: z.string(),
});

export const eventSchema = z.object({
  id: z.string(),
  name: z.string(),
  date: z.string(),
  price: z.string(),
  image: z.string(),
  category: z.string(),
  description: z.string().optional(),
  options: z.array(eventOptionSchema).optional(),
});

export type Event = z.infer<typeof eventSchema>;

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    name: "Intimate Rooftop Jazz",
    date: "June 15, 2026",
    price: "$85",
    image: "https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=800",
    category: "Intimate",
    description: "Experience the soulful melodies of live jazz under the stars. Our rooftop venue offers panoramic city views, creating the perfect atmosphere for a romantic evening or a sophisticated social gathering.",
    options: [
      { id: "opt1", name: "Standard Entry", price: 85, description: "Includes one welcome drink and unreserved seating." },
      { id: "opt2", name: "VIP Experience", price: 150, description: "Reserved premium seating, three drinks, and an appetizer platter." }
    ]
  },
  {
    id: "2",
    name: "Modern Art Gallery Tour",
    date: "June 22, 2026",
    price: "$45",
    image: "https://images.unsplash.com/photo-1518998053901-55d8d3961a9b?auto=format&fit=crop&q=80&w=800",
    category: "Cultural",
    description: "Join us for a curated tour of the city's most influential contemporary art. Discover hidden gems and renowned masterpieces while engaging in thought-provoking discussions with fellow art enthusiasts.",
    options: [
      { id: "opt3", name: "Guided Tour", price: 45, description: "Full access to the gallery with a professional art historian guide." },
      { id: "opt4", name: "Collector's Pass", price: 90, description: "Includes guided tour, a limited edition print, and a private reception." }
    ]
  },
  {
    id: "3",
    name: "Sunset Vineyard Tasting",
    date: "July 04, 2026",
    price: "$120",
    image: "https://images.unsplash.com/photo-1506377247377-2a5b3b0ca7df?auto=format&fit=crop&q=80&w=800",
    category: "Outdoor",
    description: "Escape to the countryside for an afternoon of wine tasting at our boutique vineyard. Sample award-winning vintages as the sun sets over the rolling hills, accompanied by a selection of artisanal cheeses.",
    options: [
      { id: "opt5", name: "Tasting Flight", price: 120, description: "Sample of 6 premium wines with cheese pairing." },
      { id: "opt6", name: "Sommelier Choice", price: 200, description: "Private tasting session with a master sommelier and take-home bottle." }
    ]
  },
  {
    id: "4",
    name: "Architectural Walk",
    date: "July 12, 2026",
    price: "$30",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    category: "Social",
    description: "Explore the city's architectural heritage on this guided walking tour. Learn about the history and design of iconic landmarks, from neoclassical facades to cutting-edge modern skyscrapers.",
    options: [
      { id: "opt7", name: "Morning Walk", price: 30, description: "A 2-hour guided walk through the historic district." },
      { id: "opt8", name: "Extended Exploration", price: 55, description: "Morning walk plus lunch at a historic cafe and interior access to select buildings." }
    ]
  }
];

export const eventRouter = createTRPCRouter({
  getEvents: protectedProcedure.query(async () => {
    const rawEvents = await getAllDocsInCollection("events");
    return rawEvents as Event[];
  }),
  getEventById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const event = await getWithKey("events", input.id);
      return (event as Event) ?? null;
    }),
});
