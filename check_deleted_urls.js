const fs = require('fs');

const tempFile = 'not_present_urls.txt';
const routesFile = 'delete_urls_txt.txt';
const presentUrlsFile = 'final_present_urls.txt';
const missingUrlsFile = 'final_missing_urls.txt';

function checkUrlsInRoutes(tempFilePath, routesFilePath) {
  try {
    const tempUrls = readUrlsFromFile(tempFilePath);
    const routesUrls = readUrlsFromFile(routesFilePath);

    const presentUrls = [];
    const missingUrls = [];

    for (const tempUrl of tempUrls) {
      if (routesUrls.includes(tempUrl)) {
        presentUrls.push(tempUrl);
      } else {
        missingUrls.push(tempUrl);
      }
    }

    writeToFile(presentUrlsFile, presentUrls);
    writeToFile(missingUrlsFile, missingUrls);

    console.log(`Finished checking URLs. Results written to "${presentUrlsFile}" and "${missingUrlsFile}".`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

function readUrlsFromFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return fileContent.split('\n').map(url => url.trim());
  } catch (error) {
    throw new Error(`Error reading file "${filePath}": ${error.message}`);
  }
}

function writeToFile(fileName, contentArray) {
  fs.writeFileSync(fileName, contentArray.join('\n'), 'utf-8');
  console.log(`"${fileName}" created with ${contentArray.length} URLs.`);
}

checkUrlsInRoutes(tempFile, routesFile);