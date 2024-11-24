import path from "path";
import { Browser, Page } from "puppeteer";
import { urls } from "../utils";
import chalk from "chalk";
import ora from "ora";

interface arg {
  browser: Browser;
  page1: Page;
}

export const scrapJobData = async ({ browser, page1 }: arg) => {
  const spinner = ora("Initialized job scrapper").start();
  const page = await browser.newPage();
  spinner.text = "Scraping Page Loading..... ";

  try {
    await page1.close();
    await page.goto(urls.jobPage, {
      waitUntil: ["load", "networkidle0"],
      timeout: 3 * 60000,
    });

    spinner.text = "Loaded Job Page";

    console.log(chalk.yellow("Selecting UL elements"));

    // const ulElement = await page.waitForSelector("ul.");
    // const ulElement = await page.locator(".scaffold-layout__list-container").waitHandle();
    const ulElement = await page.waitForSelector(
      ".scaffold-layout__list-container",
      { timeout: 30000 }
    );

    spinner.text = "ul element selecting process completed";

    if (ulElement) {
      console.log("Found the <ul> element!");

      // Optionally, extract the HTML content of the <ul>
      const ulHtml = await page.evaluate((el) => el.outerHTML, ulElement);
      console.log("HTML content of the <ul>:", ulHtml);
      spinner.succeed("Found the <ul> element!");
    } else {
      console.log("<ul> element not found!");
      spinner.fail("Failed to find the <ul> element!");
    }
  } catch (error: any) {
    spinner.fail("En error occurred!");
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
