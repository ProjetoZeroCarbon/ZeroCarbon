import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();

// Necessário atrás de proxy (Render, Railway etc.) para o rate limit ver o IP real
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Sem Origin = curl/Postman/mesmo domínio
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      callback(null, false);
    },
  })
);
app.use(express.json({ limit: "100kb" }));

app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
