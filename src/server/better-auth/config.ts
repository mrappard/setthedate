import { betterAuth } from "better-auth";
import { env } from "~/env";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: env.BETTER_AUTH_GOOGLE_SECRET,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
