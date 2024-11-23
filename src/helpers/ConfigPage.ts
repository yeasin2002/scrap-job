import { Page } from "puppeteer";

export const configPage = async (page: Page) => {
  await page.setViewport({ width: 1080, height: 1024 });
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );
};
