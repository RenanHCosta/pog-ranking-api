import { ACCOUNT_API, RIOT_AMERICAS_BASE_API_URL } from "../constants";

interface IGetPlayerPuuidResponse {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export async function getPlayerPuuid(
  gameName: string,
  tagLine: string
): Promise<IGetPlayerPuuidResponse> {
  const response = await fetch(
    `${RIOT_AMERICAS_BASE_API_URL}/${ACCOUNT_API}/${gameName}/${tagLine}`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY as string,
      },
    }
  );

  const data = await response.json();

  if (response.status !== 200) {
    console.error(
      `[getPlayerPuuid] ${data?.status?.message || "Something went wrong"}`
    );

    return { puuid: "", gameName: "", tagLine: "" };
  }

  return data;
}
