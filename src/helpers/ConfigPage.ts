import { Page } from "puppeteer";
import userAgent from "user-agents";

export const configPage = async (page: Page) => {
  // await page.setViewport({ width: 1080, height: 1024 });
  await page.setViewport({
    width: 1920 + Math.floor(Math.random() * 100),
    height: 3000 + Math.floor(Math.random() * 100),
    deviceScaleFactor: 1,
    hasTouch: false,
    isLandscape: false,
    isMobile: false,
  });
  await page.setUserAgent(userAgent.random().toString());
};
