import { headers } from "next/headers";
import { authClient } from "./_lib/auth-client";
import { redirect } from "next/navigation";
import { getHomePageData } from "./_lib/api/fetch-generated";
import dayjs from "dayjs";

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const homeData = await getHomePageData(dayjs().format("YYYY-MM-DD"));

  console.log(homeData);

  return (
    <div>
      <h1>Fit AI</h1>
    </div>
  );
}
