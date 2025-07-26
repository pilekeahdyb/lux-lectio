import { scrapeAelfOffice } from "./aelf-scraper";

scrapeAelfOffice("laudes", "2025-06-15").then(result => {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
