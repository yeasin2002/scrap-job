import puppeteer from "puppeteer";
import { envs, sleep } from "./utils";

const init = async () => {
  const url = {
    loginPage: `https://www.linkedin.com/login`,
    jobPage: `https://www.linkedin.com/jobs/search/?currentJobId=4063504203&keywords=remote&origin=JOBS_HOME_KEYWORD_SUGGESTION;`,
  };

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 100,
    timeout: 60000,
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  // 1. Login
  await page.goto(url.loginPage, { waitUntil: "load" });

  await page.type("#username", envs.linkedinEmail);
  await page.type("#password", envs.linkedinPassword);
  await page.click('button[type="submit"]');

  await sleep(10000);
  await browser.close();
};

init();
