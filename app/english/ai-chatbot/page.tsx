import ChatWrapper from "@/components/Hume/ChatWrapper";
import { getHumeAccessToken } from "@/utils/getHumeAccessToken";

export default async function Page() {
  const accessToken = await getHumeAccessToken();

  if (!accessToken) {
    throw new Error("Failed to obtain Hume access token. Check API credentials.");
  }

  return (
    <div className={"grow flex flex-col w-full min-h-screen "}>
      <ChatWrapper accessToken={accessToken} />
    </div>
  );
}
