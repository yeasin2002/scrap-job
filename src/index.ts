import puppeteer from "puppeteer";

const init = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(
    "https://www.linkedin.com/jobs/search/?currentJobId=4063504203&keywords=remote&origin=JOBS_HOME_KEYWORD_SUGGESTION"
  );
  await page.setViewport({ width: 1080, height: 1024 });
  // await page.waitForSelector("ul.scaffold-layout__list-container");

  await page.screenshot({
    path: "linkedin.png",
  });

  // const ulElement = await page.waitForSelector(
  //   "ul.scaffold-layout__list-container",
  //   {
  //     visible: true,
  //     timeout: 5000,
  //   }
  // );

  // if (ulElement) {
  //   console.log("Found UL");
  // } else {
  //   console.log("Not Found");
  // }

  // const data = await page.evaluate(() => {
  //   const ul = document.querySelector("ul.scaffold-layout__list-container");
  //   return ul.textContent;
  // });

  await browser.close();
};

init();
