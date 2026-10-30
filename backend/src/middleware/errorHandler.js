import { HttpError } from "../utils/httpError.js";

export function notFound(_req, _res, next) {
  next(new HttpError(404, "Rota não encontrada."));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ message: "Imagem grande demais." });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON inválido no corpo da requisição." });
  }
  console.error(err);
  res.status(500).json({ message: "Erro interno do servidor." });
}
