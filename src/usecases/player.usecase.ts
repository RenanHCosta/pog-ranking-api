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

  async delete(id: string) {
    const data = await this.playerRepository.delete(id);

    return data;
  }
}

export { PlayerUseCase };
