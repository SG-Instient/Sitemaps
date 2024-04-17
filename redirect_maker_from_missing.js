const fs = require('fs');

const missing_path = 'final_missing_urls.txt';
const routes_path = 'routes.txt';
const redirects_path = 'redirect-data.ts';
const output_path = 'script_added_redirects.txt';

let missing = [];
let routes = [];
let redirects = {};
let output = {};

function getData(){
  missing = readUrlsFromFile(missing_path);
  routes = readUrlsFromFile(routes_path);
  redirects = require('./redirect-data.js');
}

function readUrlsFromFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return fileContent.split('\n').map(url => url.trim());
    } catch (error) {
      throw new Error(`Error reading file "${filePath}": ${error.message}`);
    }
}

async function main(){
  getData();

  let added_redirects = {};
  
  // 1. present in routes with case change
  let still_missing = [];

  for (let i = 0; i < missing.length; ++i) {
    const miss_url = missing[i].toLowerCase();
    
    let j = 0;
    if (!(missing[i] in added_redirects)) {
      for (; j < routes.length; ++j) {
        const route_url = routes[j].toLowerCase();
        if (miss_url === route_url) {
          added_redirects[missing[i]] = routes[j];
          break;
        }
      }
    }

    if (j == routes.length){
      still_missing.push(missing[i]);
    }
  }

  // 2. present in redirect keys with changed case
  let still_missing_2 = [];

  const redirect_keys = Object.keys(redirects);
  for (let i = 0; i < still_missing.length; ++i) {
    const miss_url = still_missing[i].toLowerCase();
    if (!(still_missing[i] in added_redirects)) {
      let j = 0;
      for (; j < redirect_keys.length; ++j) {
        const route_url = redirect_keys[j].toLowerCase();
        if (miss_url === route_url) {
          added_redirects[still_missing[i]] = redirects[redirect_keys[j]];
          break;
        }
      }
      if (j === redirect_keys.length) {
        still_missing_2.push(still_missing[i]);
      }
    }
  }

  // console.log(still_missing_2, '\n', still_missing_2.length);

  // 3. company urls using -Company_Hash-
  let still_missing_3 = [];

  for (let i = 0; i < still_missing_2.length; ++i) {
    const miss_url = still_missing_2[i].toLowerCase();

    const company_hash_list = miss_url.split('-');
    if(company_hash_list.length < 2){
      still_missing_3.push(still_missing_2[i]);
      continue;
    }
    let company_hash = company_hash_list[1];
    if(company_hash.length != 3){
      if(company_hash_list.length < 4){
        still_missing_3.push(still_missing_2[i]);
        continue;
      }
      company_hash = company_hash_list[3];
      if(company_hash.length != 3){
        still_missing_3.push(still_missing_2[i]);
        continue;
      }
    }
    const search_hash = '-' + company_hash + '-';
    
    if (still_missing_2[i] in added_redirects)
      continue;

    let j = 0;
    for (; j < routes.length; ++j) {
      const route_url = routes[j];
      if (route_url.includes(search_hash)) {
        added_redirects[still_missing_2[i]] = routes[j];
        break;
      }
    }
    if (j == routes.length){
      still_missing_3.push(still_missing_2[i]);
    }
  }

  // 4. Inactive towns to be added in deleted based on /{town_hash}-
  let still_missing_4 = [];
  let deleted = [];

  for (let i = 0; i < still_missing_3.length; ++i) {
    const miss_url = still_missing_3[i].toLowerCase();

    let town_hash;
    try {
      town_hash = miss_url.split('/')[2].split('-')[0];
    } catch (err) {
      still_missing_4.push(still_missing_3[i]);
      continue;
    }
    const search_hash = '/' + town_hash + '-';

    if(search_hash.length !== 5 || search_hash === '/s01-'){
      still_missing_4.push(still_missing_3[i]);
      continue;
    }
    
    if (still_missing_3[i] in added_redirects)
      continue;

    let j = 0;
    for (; j < routes.length; ++j) {
      const route_url = routes[j];
      if (route_url.includes(search_hash)) {
        // added_redirects[still_missing_3[i]] = routes[j];
        still_missing_4.push(still_missing_3[i]);
        break;
      }
    }
    if (j == routes.length){
      deleted.push(still_missing_3[i]);
    }
  }

  console.log(added_redirects, '\n', Object.keys(added_redirects).length);
  console.log(deleted, '\n', deleted.length);
  console.log(still_missing_4, '\n', still_missing_3.length);

}

main();