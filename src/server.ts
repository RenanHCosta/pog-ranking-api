import fastify from "fastify";
import { playerRoutes } from "./routes/player.routes";

const app = fastify();

app.register(playerRoutes, {
  prefix: "/players",
});

app.listen({ port: Number(process.env.PORT) || 3333 }, () => {
  console.log(`Server is running on port ${process.env.PORT ?? 3333}`);
});
