import { LEAGUE_API, RIOT_BR1_BASE_API_URL } from "../constants";
import type { QueueType, Rank, Tier } from "../typings";

interface IGetPlayerLeagueResponse {
  leagueId: string;
  queueType: QueueType;
  tier: Tier;
  rank: Rank;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

const getPlayerLeagueResponseFallback: IGetPlayerLeagueResponse = {
  leagueId: "",
  queueType: "RANKED_SOLO_5x5",
  tier: "UNRANKED",
  rank: "UNRANKED",
  summonerId: "",
  leaguePoints: 0,
  wins: 0,
  losses: 0,
  veteran: false,
  inactive: true,
  freshBlood: false,
  hotStreak: false,
};

export async function getPlayerLeague(
  summonerId: string
): Promise<IGetPlayerLeagueResponse[]> {
  const response = await fetch(
    `${RIOT_BR1_BASE_API_URL}/${LEAGUE_API}/${summonerId}`,
    {
      headers: {
        "X-Riot-Token": process.env.RIOT_API_KEY as string,
      },
    }
  );

  const data = await response.json();

  if (response.status !== 200) {
    console.error(
      data?.status?.message || "[getPlayerLeague] Something went wrong"
    );

    return [getPlayerLeagueResponseFallback];
  }

  return data;
}
