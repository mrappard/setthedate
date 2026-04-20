import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

// This page will display the specific event, it will include a large picture of the event, a title of the event, a description of the event, various option that the user can purchase, if the user purchases an option they will be taken to shoping cart.

export default async function SpecicificEvent() {
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