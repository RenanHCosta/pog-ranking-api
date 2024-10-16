import fastify from "fastify";
import cors from "@fastify/cors";
import { playerRoutes } from "./routes/player.routes";
import fastifySchedulePlugin from "@fastify/schedule";
import { AsyncTask, SimpleIntervalJob } from "toad-scheduler";
import { PlayerUseCase } from "./usecases/player.usecase";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(playerRoutes, {
  prefix: "/players",
});

const task = new AsyncTask(
  "update players data",
  () => {
    const playerUseCase = new PlayerUseCase();

    return playerUseCase.updateAll().then((result) => {
      console.log("Updated players data!");
    });
  },
  (err) => {
    /* handle errors here */
  }
);

const job = new SimpleIntervalJob({ hours: 1 }, task);

app.register(fastifySchedulePlugin);

app.listen({ port: Number(process.env.PORT) || 3333, host: "0.0.0.0" }, () => {
  console.log(`Server is running on port ${process.env.PORT ?? 3333}`);
});

app.ready().then(() => {
  app.scheduler.addSimpleIntervalJob(job);
});
