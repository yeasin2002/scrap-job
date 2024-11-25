import { Page } from "puppeteer";
import { sleep } from "../utils";
import { JobData } from "../types";

export type LiData = {
  className: string;
  id: string;
  dataOccludableJobId: string; //data-occludable-job-id
};

interface Props {
  data: LiData;
  page: Page;
  allJobsData: JobData[];
}

export const getSpecificJobData = async ({
  data,
  page,
  allJobsData,
}: Props) => {
  const element = await page.$(`#${data.id}`);
  if (element) {
    await element.click();

    // grab all elements
    const jobTitleElement = await page.$(
      ".job-details-jobs-unified-top-card__job-title h1 a"
    );

    // defining data values
    const jobTitle: string =
      (await jobTitleElement?.evaluate((element) =>
        element.textContent?.trim()
      )) || "";

    allJobsData.push({ title: jobTitle });

    // await sleep(5000);
  }
};
