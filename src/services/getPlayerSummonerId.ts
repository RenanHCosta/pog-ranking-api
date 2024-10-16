import { RIOT_BR1_BASE_API_URL, SUMMONER_API } from "../constants";

interface IGetPlayerSummonerIdResponse {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export async function getPlayerSummonerId(
  puuid: string
): Promise<IGetPlayerSummonerIdResponse> {
  const response = await fetch(
    `${RIOT_BR1_BASE_API_URL}/${SUMMONER_API}/${puuid}`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY as string,
      },
    }
  );

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data?.status?.message || "Something went wrong");
  }

  return data;
}
