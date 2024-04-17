const axios = require('axios');
const fs = require('fs');

const urls = fs.readFileSync("temp2.txt", 'utf-8');

const pageNotFoundUrls = [];
const wrongUrls = [];
const rightUrls = [];
const otherUrls = [];

async function checkUrl(url) {
  try {
    const response = await axios.get(url, { maxRedirects: 0, validateStatus: null, responseType: 'arraybuffer' });
    // const { finalUrl, status, data } = await getFinalUrlAndContent(url);
    // console.log("first request: ", data);
    if (response.status === 301) {
      let finalUrl = response.headers.location || url;
      finalUrl = "https://heatfleet.com" + finalUrl;
      const { data } = await getFinalContent(finalUrl);
      const pageTitle = extractPageTitle(data);

      if (pageTitle == 'Heatfleet') {
        console.log(pageTitle);
        if (data.includes('Page not found')) {
          pageNotFoundUrls.push(finalUrl);
        } else {
          wrongUrls.push(finalUrl);
        }
      } else {
        rightUrls.push(finalUrl);
      }
    } else {
      otherUrls.push(finalUrl);
    }
  } catch (error) {
    console.error(`Error checking URL ${url}: ${error.message}`);
  }
}

async function getFinalContent(url) {
  try {
    // const response = await axios.get(url, { maxRedirects: 0, validateStatus: null, responseType: 'arraybuffer' });
    const finalResponse = await axios.get(url, { validateStatus: null });
    // return { finalUrl, status: finalResponse.status, data: finalResponse.data.toString() };
    return { data: finalResponse.data.toString() };
  } catch (error) {
    throw new Error(`Error fetching URL ${url}: ${error.message}`);
  }
}

function extractPageTitle(html) {
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  return titleMatch ? titleMatch[1] : null;
}

async function processUrls() {
  for (let url of urls) {
    await checkUrl(url);
  }

  writeToFile('pageNotFound_Urls.txt', pageNotFoundUrls);
  writeToFile('wrong_Urls.txt', wrongUrls);
  writeToFile('right_Urls.txt', rightUrls);
  writeToFile('other_Urls.txt', otherUrls);
}

function writeToFile(fileName, contentArray) {
  fs.writeFileSync(fileName, contentArray.join('\n'), 'utf-8');
  console.log(`"${fileName}" created with ${contentArray.length} URLs.`);
}

processUrls();
