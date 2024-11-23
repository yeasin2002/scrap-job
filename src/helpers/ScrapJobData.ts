import path from "path";
import { Browser, Page } from "puppeteer";
import { urls } from "../utils";
import chalk from "chalk";

interface arg {
  browser: Browser;
  page1: Page;
}

export const scrapJobData = async ({ browser, page1 }: arg) => {
  const page = await browser.newPage();
  await page1.close();
  console.log(chalk.yellow("Scraping Page Loading.."));
  try {
    await page.goto(urls.jobPage, {
      waitUntil: ["load", "networkidle0"],
      timeout: 60000,
    });
    console.log(chalk.yellow("Selecting UL elements"));

    const ulElement = await page.$("ul.scaffold-layout__list-container");

    if (ulElement) {
      console.log("Found the <ul> element!");

      // Optionally, extract the HTML content of the <ul>
      const ulHtml = await page.evaluate((el) => el.outerHTML, ulElement);
      console.log("HTML content of the <ul>:", ulHtml);
    } else {
      console.log("<ul> element not found!");
    }
  } catch (error: any) {
    console.error(chalk.red("Error in scrapJobData: "), error?.message);
    console.log(chalk.yellow`==================================`);

    const logDir = path.resolve("log");
    const timeNow = new Date().toISOString().replace(/[:.]/g, "-");
    await page.screenshot({
      path: path.join(logDir, `error-screenshot-${timeNow}.png`),
      fullPage: true,
    });

    console.log(error);
    throw error;
  }
};

// const liTexts = await page.$$eval(
//   "ul.scaffold-layout__list-container li",
//   (lis) => {
//     return lis.map((li) => ({
//       text: li?.textContent?.trim() || "",
//       link: li?.querySelector("a")?.href || "",
//       title: li?.querySelector(".job-title")?.textContent?.trim() || "",
//     }));
//   }
// );
// console.log(`Found ${liTexts.length} jobs`);
// console.log("All li texts:", liTexts);
