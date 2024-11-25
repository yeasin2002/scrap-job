import chalk from "chalk";
import { Page } from "puppeteer";
import userAgent from "user-agents";

export const configPage = async (page: Page) => {
  await page.setViewport({ width: 1080, height: 1024 });
  await page.setUserAgent(userAgent.random().toString());
  // page.on("console", (msg) => {console.log(chalk.bgGreen.yellow.bold("PAGE LOG:"), msg.text(), "\n");});
};
