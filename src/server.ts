import fastify from "fastify";
import cors from "@fastify/cors";
import { playerRoutes } from "./routes/player.routes";

const app = fastify();

app.register(cors, {
  origin: "*",
});

app.register(playerRoutes, {
  prefix: "/players",
});

app.listen({ port: Number(process.env.PORT) || 3333, host: "0.0.0.0" }, () => {
  console.log(`Server is running on port ${process.env.PORT ?? 3333}`);
});
