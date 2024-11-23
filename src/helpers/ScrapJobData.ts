import { Page } from "puppeteer";
import { urls } from "../utils";

export const scrapJobData = async (page: Page) => {
  await page.goto(urls.jobPage, { waitUntil: ["load", "networkidle0"] });
};
