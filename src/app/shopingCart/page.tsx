import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

// This page will display the specific event, will display all the packages that the user has purchased and confirm they want to buy them

export default async function ShoppingCart() {
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