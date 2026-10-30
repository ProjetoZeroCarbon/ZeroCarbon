import { HttpError } from "./httpError.js";

export const MAX_AVATAR_BYTES = 300 * 1024; // o frontend envia ~10–40 KB

const DATA_URL_RE = /^data:image\/(?:jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/;

/** Descobre o tipo real pelos primeiros bytes (não confia no que o cliente declarou). */
function detectMime(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return "image/png";
  }
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  return null;
}

/** "data:image/jpeg;base64,..." -> { mime, buffer } ou lança HttpError. */
export function parseImageDataUrl(input) {
  if (typeof input !== "string") throw new HttpError(400, "Envie a imagem no campo \"image\".");

  const match = DATA_URL_RE.exec(input);
  if (!match) throw new HttpError(400, "Formato de imagem inválido. Use JPG, PNG ou WebP.");

  const buffer = Buffer.from(match[1], "base64");
  if (buffer.length === 0) throw new HttpError(400, "Imagem vazia.");
  if (buffer.length > MAX_AVATAR_BYTES) throw new HttpError(413, "Imagem grande demais.");

  const mime = detectMime(buffer);
  if (!mime) throw new HttpError(400, "O arquivo enviado não é uma imagem válida.");

  return { mime, buffer };
}

export const toDataUrl = (mime, buffer) => `data:${mime};base64,${buffer.toString("base64")}`;
