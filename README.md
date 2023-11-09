# Pixel game

Given an image library, generates _pixelated_ versions of each image, so that one would have to guess it's content despite the poor image quality. Different quality levels are generated so that multiple guesses can be given on different renders.

## Installation

Only NodeJs version 18 is required. Preferably install through [`nvm`](https://nodejs.org/en/download/package-manager#nvm).

## Usage

Copy your image library inside an `images` folder, and run :

```bash
$ npm start
```

or (using node) `$ node .` or even `$ node dist/index.cjs`

For each image, a folder will be created containing the image itself, and mulitple downgraded versions.

Multiple settings can be configured with environment variables (`.env` file)

- `NUMER_OF_RESIZES` : how many different downgraded images to create. (default: 5)
- `MAX_DIMENSION` : the number of pixels the least-downgraded image should have as it's height or width (whichever is the greatest in the original image). (default: 150)
- `MIN_DIMENSION` : the number of pixels the most-downgraded image should have as it's height or width (whichever is the greatest in the original image). (default: 30)

## Build from source

Install NodeJs version 18, preferably through [`nvm`](https://nodejs.org/en/download/package-manager#nvm).

Install pnpm version 8.6.11 or similar - installing using previously-installed `npm` is fine :

```bash
$ npm install -g pnpm@8.6.11
```

Install dependencies with :

```bash
$ pnpm i
```

Build sources :

```bash
$ pnpm build
```
