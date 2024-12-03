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

  // await oldPage.close();
  await page.goto(urls.jobPage, {
    waitUntil: ["load"],
    timeout: 3 * 60000,
  });

  console.log(chalk.yellow("Selecting UL elements"));

  const ulElement = await page.$("ul.aOyCSCHFVSwJUyoOASjgKbcwIYyDhN");
  spinner.text = "ul element selecting process completed";

  if (ulElement) {
    console.log("Found the <ul> element!");
    spinner.succeed("Found the <ul> element!");

    const liData: LiData[] = await page.evaluate(() => {
      const lis = document.querySelectorAll<HTMLLIElement>(
        "ul.aOyCSCHFVSwJUyoOASjgKbcwIYyDhN > li"
      );

      return (
        Array.from(lis).map((li) => ({
          id: li.id,
          dataOccludableJobId: li.getAttribute("data-occludable-job-id") || "",
          className:
            li.getAttribute("class") ||
            "ember-view   jobs-search-results__list-item occludable-update p0 relative scaffold-layout__list-item",
        })) || []
      );
    });

    console.log(`Found ${liData.length} jobs`);

    // loop only 1st 3 jobs for testing
    for (let i = 0; i < 3; i++) {
      await getSpecificJobData({ data: liData[i], page, allJobsData });
      console.log(`Scaped ${liData[i]}`);
    }
  } else {
    console.log("<ul> element not found!");
    spinner.fail("Failed to find the <ul> element!");
  }
  return;
};
