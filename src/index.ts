import puppeteer from "puppeteer-extra";
import chalk from "chalk";

//  puppeteer's plugins
import puppeteerStealthPlugin from "puppeteer-extra-plugin-stealth";
// import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import puppeteerMinmax from "puppeteer-extra-plugin-minmax";
import devtools from "puppeteer-extra-plugin-devtools";

import { configPage, scrapJobData, LoginOnLinkedin } from "./helpers";
import { sleep } from "./utils";
import { JobData } from "./types";
import path from "path";

puppeteer.use(puppeteerStealthPlugin());
puppeteer.use(puppeteerMinmax());
puppeteer.use(devtools());

const main = async () => {
  const allJobsData: JobData[] = [];
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    timeout: 3 * 60000,
    dumpio: true,
    // slowMo: 250,
  });

  const page = await browser.newPage();

  try {
    await configPage(page);

    // Steps
    await LoginOnLinkedin(page);
    await sleep(2000);
    await scrapJobData({ page, browser, allJobsData });

    await sleep(10000);
    await browser.close();
  } catch (error: any) {
    console.log(chalk.red("An Error Occurred : "), error?.message);
    console.log(chalk.yellow`==================================`);
    console.log(error);

    const logDir = path.resolve("log");
    const timeNow = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: path.join(logDir, `error-screenshot-${timeNow}.png`),
      fullPage: true,
    });
  } finally {
    console.log("🚀 All Jobs Data:", allJobsData);
  }
};

main();
