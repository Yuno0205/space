import ChatWrapper from "@/components/Hume/ChatWrapper";
import { getHumeAccessToken } from "@/utils/HumeAi/getHumeAccessToken";
import { notFound } from "next/navigation";

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    return notFound();
  }

  return (
    <div className={"grow flex flex-col w-full min-h-screen "}>
      <ChatWrapper accessToken={accessToken} />
    </div>
  );
}
