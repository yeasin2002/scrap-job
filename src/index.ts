import puppeteer from "puppeteer";
import { sleep } from "./utils";

import { configPage, scrapJobData, LoginOnLinkedin } from "./helpers";
import chalk from "chalk";

const init = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      timeout: 3 * 60000,
      slowMo: 250,
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

init();
