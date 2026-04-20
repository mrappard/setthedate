
import z from "zod";
import { getWithKey } from "~/keystore";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
} from "~/server/api/trpc";

export const ProfileType = z.object({

})


export const profileRouter = createTRPCRouter({
    getProfile: protectedProcedure
        .query(async ({ ctx }) => {

            try {
                const profile = await getWithKey("profile", ctx.session.session.id);
                if (profile) {


                    const profileParsed = ProfileType.parse(profile);
                    return profileParsed;


                }
                return profile;
            } catch (error) {
                return null;
            }



        }),

});
