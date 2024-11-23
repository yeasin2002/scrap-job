import { Page } from "puppeteer";
import { envs, urls } from "../utils";

export const LoginOnLinkedin = async (page: Page) => {
  // 1. Login
  await page.goto(urls.loginPage, { waitUntil: ["load", "networkidle0"] });

  await page.type("#username", envs.linkedinEmail);
  await page.type("#password", envs.linkedinPassword);
  await page.click('button[type="submit"]');
};
