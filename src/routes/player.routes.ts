import { FastifyInstance } from "fastify";
import { PlayerUseCase } from "../usecases/player.usecase";
import { PlayerCreate } from "../interfaces/player.interface";
import { getPlayerPuuid } from "../services/getPlayerPuuid";
import { getPlayerSummonerId } from "../services/getPlayerSummonerId";
import { getPlayerLeague } from "../services/getPlayerLeague";

export async function playerRoutes(fastify: FastifyInstance) {
  const playerUseCase = new PlayerUseCase();

  fastify.post<{ Body: PlayerCreate }>("/", async (req, reply) => {
    const { gameName, tagLine } = req.body;

    try {
      const data = await playerUseCase.create({
        gameName,
        tagLine,
      });

      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.get("/", async (req, reply) => {
    try {
      const data = await playerUseCase.findAll();

      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.put<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const { id } = req.params;

    const player = await playerUseCase.findById(id);

    if (!player) {
      return reply.status(404).send({ message: "Player not found" });
    }

    const { puuid } = await getPlayerPuuid(player.gameName, player.tagLine);

    if (!puuid) {
      return reply.status(500).send({ message: "Player Puuid not found" });
    }

    const { id: summonerId } = await getPlayerSummonerId(puuid);
    const league = await getPlayerLeague(summonerId);
    const soloQueueData = league.find(
      (league) => league.queueType === "RANKED_SOLO_5x5"
    );

    if (!soloQueueData) {
      return reply
        .status(500)
        .send({ message: "Player League data not found" });
    }

    try {
      const data = await playerUseCase.update({
        id,
        tier: soloQueueData.tier,
        rank: soloQueueData.rank,
        wins: soloQueueData.wins,
        losses: soloQueueData.losses,
        leaguePoints: soloQueueData.leaguePoints,
      });

      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.delete<{ Params: { id: string } }>("/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const data = await playerUseCase.delete(id);
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });
}
