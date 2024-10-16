import { prisma } from "../database/prisma-client";
import {
  Player,
  PlayerCreate,
  PlayerRepository,
  PlayerUpdate,
} from "../interfaces/player.interface";

class PlayerRepositoryPrisma implements PlayerRepository {
  async create(data: PlayerCreate): Promise<Player> {
    const result = await prisma.player.create({
      data: {
        gameName: data.gameName,
        tagLine: data.tagLine,
        tier: "",
        rank: "",
        wins: 0,
        losses: 0,
        leaguePoints: 0,
      },
    });

    return result;
  }
  async findByNameAndTag(
    gameName: string,
    tagLine: string
  ): Promise<Player | null> {
    const result = await prisma.player.findFirst({
      where: {
        gameName,
        tagLine,
      },
    });

    return result || null;
  }

  async findAll(): Promise<Player[]> {
    const result = await prisma.player.findMany();

    return result;
  }

  async findById(id: string): Promise<Player | null> {
    const result = await prisma.player.findUnique({
      where: {
        id,
      },
    });

    return result || null;
  }

  async update({
    id,
    tier,
    rank,
    wins,
    losses,
    leaguePoints,
  }: PlayerUpdate): Promise<Player> {
    const result = await prisma.player.update({
      where: {
        id,
      },
      data: {
        tier,
        rank,
        wins,
        losses,
        leaguePoints,
      },
    });

    return result;
  }

  async delete(id: string): Promise<boolean> {
    const result = await prisma.player.delete({
      where: {
        id,
      },
    });

    return result ? true : false;
  }
}

export { PlayerRepositoryPrisma };
