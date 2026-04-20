import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

// This page will will include the ability to upload a picture of your drivers license to validate your identity.
export default async function ValidateIdentity() {
  const session = await getSession();

  if (session) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="">
        <div>This page is for Logging in with the user</div>
      </main>
    </HydrateClient>
  );
}