const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// high: 1200
// q: 95

// low: 800
// q: 60

// async function runCompressor(width, quality, inputPath, outputPath){

// }
async function compressionHandler(file, outputDir, quality = 60, width = 800) {
  
  return new Promise((resolve, reject) => {
    const pathToImage = path.join(__dirname, "/input", file);

    const readStream = fs.createReadStream(pathToImage);
    const fileName = path.basename(readStream.path);
    const outputPath = path.join(__dirname, outputDir, fileName);

    sharp(pathToImage)
      .webp({ quality })
      .toFile(outputPath, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
  });
}

async function compressImages(outputDir, quality = 60, width = 800) {
  try {
    console.log("Image compression started");
    const inputDir = path.join(__dirname, "/input");
    const inputFiles = await fs.promises.readdir(inputDir);

    const compressPromises = inputFiles.map((file) =>
      compressionHandler(file, outputDir, quality, width)
    );
    const compressionResults = await Promise.all(compressPromises);

    console.log(`\x1b[44m \x1b[42m ${inputFiles?.length} ${inputFiles?.length > 1 ? "files have" : "file has" } been compressed `);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

// configuration
const outputDir = "/output";
const width = 800;
const quality = 40;


app.listen(3001, () => {
  compressImages(outputDir, quality, width);
});

// currently working formats ( png, jpg,webp)
