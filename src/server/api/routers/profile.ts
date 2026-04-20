import { z } from "zod";
import { getWithKey, saveWithKey } from "~/keystore";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const profileSchema = z.object({
  name: z.string().min(1),
  birthDate: z.string().optional(),
  salary: z.string().optional(),
  race: z.string().optional(),
  religion: z.string().optional(),
  height: z.string().optional(),
  lookingFor: z.string().optional(),
  image: z.string().optional(),
  userId: z.string(),
  updatedAt: z.union([z.date(), z.any()]), // Firestore might return a Timestamp
});

export type Profile = z.infer<typeof profileSchema>;

export const profileRouter = createTRPCRouter({
  saveProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        birthDate: z.string().optional(),
        salary: z.string().optional(),
        race: z.string().optional(),
        religion: z.string().optional(),
        height: z.string().optional(),
        lookingFor: z.string().optional(),
        image: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const profile: Profile = {
        ...input,
        userId,
        updatedAt: new Date(),
      };
      try {
         await saveWithKey("profiles", userId, profile);
      } catch (error) {
        console.log(error);
      }
     
      return profile;
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    try {
   const rawProfile = await getWithKey("profiles", userId);
    
    // Check with ZOD and return if it matches, otherwise return the empty object/defaults
    const result = profileSchema.safeParse(rawProfile);

    if (!result.success) {
      return {
        name: ctx.session.user.name ?? "",
        image: ctx.session.user.image ?? "",
        birthDate: "",
        salary: "",
        race: "",
        religion: "",
        height: "",
        lookingFor: "",
      };
    }
    
    return result.data;
    } catch {
        return null;
    }
 
  }),
});
