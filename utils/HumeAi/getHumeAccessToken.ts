import "server-only";

import { fetchAccessToken } from "hume";

export const getHumeAccessToken = async () => {
  if (!process.env.HUME_API_KEY || !process.env.HUME_SECRET_KEY) {
    return null;
  }
  try {
    const accessToken = await fetchAccessToken({
      apiKey: String(process.env.HUME_API_KEY),
      secretKey: String(process.env.HUME_SECRET_KEY),
    });

    if (accessToken === "undefined") {
      return null;
    }

    return accessToken ?? null;
  } catch (error) {
    console.error("Failed to fetch Hume access token:", error);
    return null;
  }
};
