import { Page } from "puppeteer";
import { envs, urls } from "../utils";
import chalk from "chalk";

export const LoginOnLinkedin = async (page: Page) => {
  console.log(chalk.yellow("Login Processing"));
  await page.goto(urls.loginPage, {
    waitUntil: ["load", "networkidle0"],
    timeout: 60000,
  });

  await page.type("#username", envs.linkedinEmail);
  await page.type("#password", envs.linkedinPassword);
  await page.locator('button[type="submit"]').click();

  console.log(chalk.green("Login Successful"));
  return;
};
