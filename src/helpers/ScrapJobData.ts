import path from "path";
import { Browser, Page } from "puppeteer";
import chalk from "chalk";
import ora from "ora";

import { urls } from "../utils";
import { getSpecificJobData, type LiData } from "./getSpecificJobData";
import { JobData } from "../types";

interface arg {
  page: Page;
  browser: Browser;
  allJobsData: JobData[];
}

export const scrapJobData = async ({
  browser,
  page: oldPage,
  allJobsData,
}: arg) => {
  const spinner = ora("Initialized job scrapper").start();
  spinner.text = "Scraping Page Loading..... ";

  const page = await browser.newPage();

  // page.on("requestfailed", (request) => {
  //   console.error(`Request failed: ${request.url()}`);
  // });

  try {
    await oldPage.close();
    await page.goto(urls.jobPage, {
      waitUntil: ["load"],
      timeout: 3 * 60000,
    });

    console.log(chalk.yellow("Selecting UL elements"));

    const ulElement = await page.$("ul.scaffold-layout__list-container");
    spinner.text = "ul element selecting process completed";

    if (ulElement) {
      console.log("Found the <ul> element!");
      spinner.succeed("Found the <ul> element!");

      const liData: LiData[] = await page.evaluate(() => {
        const lis = document.querySelectorAll<HTMLLIElement>(
          "ul.scaffold-layout__list-container > li"
        );

        return (
          Array.from(lis).map((li) => ({
            id: li.id,
            dataOccludableJobId:
              li.getAttribute("data-occludable-job-id") || "",
            className:
              li.getAttribute("class") ||
              "ember-view   jobs-search-results__list-item occludable-update p0 relative scaffold-layout__list-item",
          })) || []
        );
      });

      console.log(`Found ${liData.length} jobs`);

      // loop only 1st 5 jobs
      for (let i = 0; i < 5; i++) {
        await getSpecificJobData({ data: liData[i], page, allJobsData });
      }
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
