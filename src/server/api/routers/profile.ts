import { z } from "zod";
import { getWithKey, saveWithKey } from "~/keystore";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";


/* Make this into a Zod Object */
export interface Profile {
  name: string;
  birthDate?: string;
  salary?: string;
  race?: string;
  religion?: string;
  height?: string;
  lookingFor?: string;
  image?: string;
  userId: string;
  updatedAt: Date;
}



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
      saveWithKey("profiles",userId, profile )
      return profile;
    }),

  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const profile = getWithKey("profiles",userId,)
    //Check with ZOD and return if it matches, otherwise return the empty object


    if (!profile) {
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
    
    
    return profile;
  }),
});
