import path from "path";
import { Browser, Page } from "puppeteer";
import chalk from "chalk";
import ora from "ora";
import fs from "fs";

import { urls } from "../utils";

interface arg {
  browser: Browser;
  page1: Page;
}

export const scrapJobData = async ({ browser, page1: page }: arg) => {
  const spinner = ora("Initialized job scrapper").start();
  // const page = await browser.newPage();
  spinner.text = "Scraping Page Loading..... ";

  page.on("requestfailed", (request) => {
    console.error(`Request failed: ${request.url()}`);
  });

  try {
    // await page1.close();
    await page.goto(urls.jobPage, {
      waitUntil: ["load"],
      timeout: 3 * 60000,
    });

    spinner.text = "Loaded Job Page";

    console.log(chalk.yellow("Selecting UL elements"));

    const ulElement = await page.$("ul.scaffold-layout__list-container");

    spinner.text = "ul element selecting process completed";

    if (ulElement) {
      console.log("Found the <ul> element!");

      type LiData = {
        text: string;
        link: string;
        title: string;
      };

      const liData: LiData[] = await page.evaluate(() => {
        // Select all <li> elements inside the <ul> with the specified class
        const lis = document.querySelectorAll<HTMLLIElement>(
          "ul.scaffold-layout__list-container > li"
        );

        // Map through NodeList to extract relevant information
        return Array.from(lis).map((li) => ({
          text: li.textContent?.trim() || "", // Ensure textContent is not null
          link: li.querySelector<HTMLAnchorElement>("a")?.href || "", // Extract the link if available
          title:
            li.querySelector<HTMLElement>(".job-title")?.textContent?.trim() ||
            "", // Extract title if available
        }));
      });

      console.log("Extracted <li> data:", liData);

      spinner.succeed("Found the <ul> element!");
    } else {
      console.log("<ul> element not found!");
      spinner.fail("Failed to find the <ul> element!");
    }
    return;
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
