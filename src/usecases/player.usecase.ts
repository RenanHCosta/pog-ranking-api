import { getPlayerLeague } from "../external/services/get-player-league";
import { getPlayerPuuid } from "../external/services/get-player-puuid";
import { getPlayerSummonerId } from "../external/services/get-player-summoner-id";
import {
  Player,
  PlayerCreate,
  PlayerRepository,
  PlayerUpdate,
} from "../interfaces/player.interface";
import { PlayerRepositoryPrisma } from "../repositories/player.repository";

class PlayerUseCase {
  private playerRepository: PlayerRepository;

  constructor() {
    this.playerRepository = new PlayerRepositoryPrisma();
  }

  async create({ gameName, tagLine }: PlayerCreate): Promise<Player> {
    const verifyIfPlayerExists = await this.playerRepository.findByNameAndTag(
      gameName,
      tagLine
    );

    if (verifyIfPlayerExists) {
      throw new Error("Player already exists");
    }

    const result = await this.playerRepository.create({
      gameName,
      tagLine,
    });

    return result;
  }

  async findAll(): Promise<Player[]> {
    const result = await this.playerRepository.findAll();
    return result;
  }

  async findById(id: string): Promise<Player | null> {
    const result = await this.playerRepository.findById(id);
    return result;
  }

  async update({
    id,
    tier,
    rank,
    wins,
    losses,
    leaguePoints,
  }: PlayerUpdate): Promise<Player> {
    const result = await this.playerRepository.update({
      id,
      tier,
      rank,
      wins,
      losses,
      leaguePoints,
    });

    return result;
  }

  async updateAll() {
    const players = await this.playerRepository.findAll();

    for (const player of players) {
      const { puuid } = await getPlayerPuuid(player.gameName, player.tagLine);

      if (!puuid) {
        console.error(
          `[updateAll] ${player.gameName} - ${player.tagLine} puuid not found`,
          puuid
        );

        continue;
      }

      const { id: summonerId } = await getPlayerSummonerId(puuid);
      const league = await getPlayerLeague(summonerId);

      const soloQueueData = league.find(
        (league) => league.queueType === "RANKED_SOLO_5x5"
      );

      if (!soloQueueData) {
        console.error(
          `[updateAll] ${player.gameName} - ${player.tagLine} league data not found`,
          soloQueueData
        );

        continue;
      }

      await this.playerRepository.update({
        id: player.id,
        tier: soloQueueData.tier,
        rank: soloQueueData.rank,
        wins: soloQueueData.wins,
        losses: soloQueueData.losses,
        leaguePoints: soloQueueData.leaguePoints,
      });
    }

    return players;
  }

  async delete(id: string) {
    const data = await this.playerRepository.delete(id);

    return data;
  }
}

export { PlayerUseCase };
