const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const mediaTypes = ['movies', 'books', 'tv-shows', 'video-games'];

mediaTypes.forEach(mediaType => {
  const sourceDir = path.join(__dirname, `../mediaDB/${mediaType}/processedMediaFiles`);
  const destDir = path.join(__dirname, `./app/reddish-reviews/${mediaType}/media`);

  if (fs.existsSync(sourceDir)) {
    fse.copySync(sourceDir, destDir, { overwrite: true });
    console.log(`Copied ${mediaType} processed files to ${destDir}`);
  } else {
    console.log(`Source directory for ${mediaType} does not exist: ${sourceDir}`);
  }
});