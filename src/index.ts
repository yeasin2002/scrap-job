import puppeteer from "puppeteer-extra";
import chalk from "chalk";

//  puppeteer's plugins
import puppeteerStealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import puppeteerMinmax from "puppeteer-extra-plugin-minmax";
import devtools from "puppeteer-extra-plugin-devtools";

import { configPage, scrapJobData, LoginOnLinkedin } from "./helpers";
import { sleep } from "./utils";

puppeteer.use(puppeteerStealthPlugin());
// puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
puppeteer.use(puppeteerMinmax());
puppeteer.use(devtools());

const main = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      timeout: 3 * 60000,
      dumpio: true,
      // slowMo: 250,
    });

    const page = await browser.newPage();
    await configPage(page);

    // Steps
    await LoginOnLinkedin(page);
    await sleep(2000);
    await scrapJobData({ browser, page1: page });

    await sleep(10000);
    await browser.close();
  } catch (error: any) {
    console.log(chalk.red("An Error Occurred : "), error?.message);
    console.log(chalk.yellow`==================================`);
    console.log(error);
  }
};

main();
