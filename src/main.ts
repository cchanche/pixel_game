import * as path from 'path';
import * as fs from 'fs';
import { Logger } from './utils';
import Jimp from 'jimp';
import * as dotenv from 'dotenv';
dotenv.config(); // .env file is parsed by cdk within stacks, but not here

export const handler = (async () => {
  const logger = new Logger('build');

  const IMG_FOLDER = 'images';
  const IMG_FOLDER_PATH = path.join(IMG_FOLDER);

  const envArr = process.env.RESIZE_ARRAY?.toString()
    .split(',')
    .map((e) => e.trim())
    .filter((e) => !!e)
    .map((e) => parseInt(e));
  const RESIZE_ARRAY = envArr?.length ? envArr : [0, 5, 10, 15, 20];

  logger.log(`Using resize-array : ${RESIZE_ARRAY}`);

  if (!fs.existsSync(IMG_FOLDER_PATH)) {
    logger.log('Destination directory does not exists. Creating...');
    fs.mkdirSync(IMG_FOLDER_PATH, { recursive: true });
    logger.log('Created folder ' + IMG_FOLDER_PATH);
  }

  logger.log('Reading image entries...');
  const entries = fs.readdirSync(IMG_FOLDER_PATH, { withFileTypes: true });

  const images = entries.filter((e) => e.isFile());

  logger.log('Found images :');
  for (const img of images) {
    logger.log(`  ${img.name}`);
  }

  for (const dirent of images) {
    logger.log(`Process : ${dirent.name}...`);

    const fileNameParsed = path.parse(dirent.name);
    const name = fileNameParsed.name;
    const ext = fileNameParsed.ext;

    // Check image format
    if (
      ext !== '.bmp' &&
      ext !== '.gif' &&
      ext !== '.jpeg' &&
      ext !== '.png' &&
      ext !== '.tiff'
    ) {
      logger.error(`  Image ${dirent.name} has wrong format (${ext})`);
      continue;
    }

    // Get or create output dir
    const outDir = path.join(IMG_FOLDER_PATH, fileNameParsed.name);
    if (fs.existsSync(outDir)) {
      logger.log('  Destination already exists. Emptying...');
      fs.rmSync(outDir, { recursive: true });
      fs.mkdirSync(outDir);
    } else {
      fs.mkdirSync(outDir);
      logger.log('  Created folder ' + outDir);
    }

    // Read image
    const image = await Jimp.read(path.join(IMG_FOLDER_PATH, dirent.name));

    const W = image.getWidth();

    for (const size of RESIZE_ARRAY) {
      // Resize the image to width 150 and auto height.
      size &&
        (await image.resize(W / size, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR));
      await image.resize(W, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR);

      const writeFilePath = path.join(
        outDir,
        `${name}_${(size * 100).toString()}${ext}`,
      );

      // Save and overwrite the image
      await image.writeAsync(writeFilePath);
      logger.log(`  Wrote file ${writeFilePath}`);
    }
  }
})();
