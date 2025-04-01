import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";

export const generateThumbHash = async (url: string): Promise<string> => {
  const maxSize = 100;
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { data, info } = await sharp(buffer)
    .resize(maxSize, maxSize, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const thumbHash = rgbaToThumbHash(info.width, info.height, data);
  return Buffer.from(thumbHash).toString("base64");
};
