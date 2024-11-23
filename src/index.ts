import puppeteer from "puppeteer";
import { envs, sleep } from "./utils";

import { scrapJobData, LoginOnLinkedin } from "./helpers";

const init = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1024 });

    // Steps
    await LoginOnLinkedin(page);
    await scrapJobData(page);

    await sleep(10000);
    await browser.close();
  } catch (error: any) {
    console.log("An Error Occurred : ", error?.message);
    console.log(`==================================`);
    console.log(error);
  }
};

init();
