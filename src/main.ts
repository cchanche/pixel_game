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

  const NUMER_OF_RESIZES = process.env.NUMER_OF_RESIZES
    ? parseInt(process.env.NUMER_OF_RESIZES)
    : 5;
  const MAX_DIMENSION = process.env.MAX_DIMENSION
    ? parseInt(process.env.MAX_DIMENSION)
    : 150;
  const MIN_DIMENSION = process.env.MIN_DIMENSION
    ? parseInt(process.env.MIN_DIMENSION)
    : 30;

  // Create height scale
  const dimensionsArray = [];
  for (let i = 0; i < NUMER_OF_RESIZES; i++) {
    dimensionsArray.push(
      Math.floor(
        MAX_DIMENSION *
          Math.pow(MIN_DIMENSION / MAX_DIMENSION, i / (NUMER_OF_RESIZES - 1)),
      ),
    );
  }

  logger.log(`Dimension scale is : ${dimensionsArray}`);

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
      ext !== '.jpg' &&
      ext !== '.jpeg' &&
      ext !== '.png' &&
      ext !== '.tiff'
    ) {
      logger.error(`  Image ${dirent.name} has wrong format (${ext})`);
      continue;
    }

    // Get or create output dir
    const outDir = path.join(IMG_FOLDER_PATH, fileNameParsed.name);
    if (fs.existsSync(outDir) && fs.readdirSync(outDir).length !== 0) {
      logger.log('  Destination already exists. skipping...');
      continue;
    } else if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
      logger.log('  Created folder ' + outDir);
    }

    for (const resizeDimension of dimensionsArray) {
      // Read image
      const image = await Jimp.read(path.join(IMG_FOLDER_PATH, dirent.name));
      const IMG_HEIGHT = image.getHeight();
      const IMG_WIDTH = image.getWidth();

      if (IMG_HEIGHT > IMG_WIDTH) {
        // Resize the image to custom height and auto width.
        image.resize(Jimp.AUTO, resizeDimension, Jimp.RESIZE_NEAREST_NEIGHBOR);

        // Reset image to previus resolution
        image.resize(Jimp.AUTO, IMG_HEIGHT, Jimp.RESIZE_NEAREST_NEIGHBOR);
      } else {
        // Resize the image to custom height and auto width.
        image.resize(resizeDimension, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR);

        // Reset image to previus resolution
        image.resize(IMG_WIDTH, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR);
      }

      const writeFilePath = path.join(
        outDir,
        `${name}_${(
          dimensionsArray.findIndex((r) => r === resizeDimension) + 1
        ).toString()}${ext}`,
      );

      // Save and overwrite the image
      await image.writeAsync(writeFilePath);
      logger.log(`  Wrote file ${writeFilePath}`);
    }

    // Copy original
    fs.copyFileSync(
      path.join(IMG_FOLDER_PATH, dirent.name),
      path.join(outDir, `${name}_0${ext}`),
    );
  }
})();
