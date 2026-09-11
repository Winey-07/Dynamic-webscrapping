// ==========================================
// playwrightScraper.js
// Dynamic PlaywrightCrawler for JS-rendered pages
// ==========================================

const { PlaywrightCrawler } = require("crawlee");

async function scrapeWithPlaywright(website) {
  const scrapedItems = [];

  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 1,

    // Launch options to make it run faster and headless (invisible)
    launchContext: {
      launchOptions: {
        headless: true,
      },
    },

    async requestHandler({ request, page, log }) {
      log.info(`Scraping ${website.name}: ${request.url}...`);

      const titleSelector = website.title_selector || "a";
      const linkSelector = website.link_selector || titleSelector;
      const descSelector = website.description_selector;
      const imgSelector = website.image_selector;
      const authorSelector = website.author_selector;
      const dateSelector = website.date_selector;

      // 1. Wait for the main content to load on the screen
      // This prevents extracting data before JS renders it
      try {
        await page.waitForSelector(titleSelector, { timeout: 10000 });
      } catch (e) {
        log.warning(`Selector ${titleSelector} not found within 10 seconds.`);
        return;
      }

      // 2. Extract data using page.$$eval
      // $$eval runs a function inside the browser context
      const rawItems = await page.$$eval(
        titleSelector,
        (elements, config) => {
          const {
            linkSelector,
            descSelector,
            imgSelector,
            authorSelector,
            dateSelector,
          } = config;

          return elements.map((el) => {
            const title = el.innerText.trim();

            // Find the link element
            const linkEl =
              linkSelector === titleSelector
                ? el
                : el.querySelector(linkSelector) || el.closest(linkSelector);

            const partialUrl = linkEl
              ? linkEl.href || linkEl.getAttribute("href")
              : null;

            // Find optional fields relative to the title element
            // Note: This is simplified. Depending on HTML structure, you might need to traverse up
            const description = descSelector
              ? el
                  .closest("div")
                  ?.querySelector(descSelector)
                  ?.innerText.trim() || null
              : null;
            const imageUrl = imgSelector
              ? el.closest("div")?.querySelector(imgSelector)?.src || null
              : null;
            const author = authorSelector
              ? el
                  .closest("div")
                  ?.querySelector(authorSelector)
                  ?.innerText.trim() || null
              : null;
            const publishedAt = dateSelector
              ? el
                  .closest("div")
                  ?.querySelector(dateSelector)
                  ?.getAttribute("datetime") || null
              : null;

            return {
              title,
              partialUrl,
              description,
              imageUrl,
              author,
              publishedAt,
            };
          });
        },
        {
          linkSelector,
          descSelector,
          imgSelector,
          authorSelector,
          dateSelector,
        },
      );

      // 3. Normalize URLs and push to array (Done in Node.js context)
      for (const item of rawItems) {
        if (item.title && item.partialUrl) {
          try {
            const absoluteUrl = new URL(item.partialUrl, request.loadedUrl)
              .href;
            let finalImageUrl = null;
            if (item.imageUrl) {
              finalImageUrl = new URL(item.imageUrl, request.loadedUrl).href;
            }

            scrapedItems.push({
              title: item.title,
              url: absoluteUrl,
              description: item.description || null,
              imageUrl: finalImageUrl,
              author: item.author || null,
              publishedAt: item.publishedAt || null,
            });
          } catch (e) {
            log.warning(`Failed to process URL: ${item.partialUrl}`);
          }
        }
      }
    },
  });

  await crawler.run([website.url]);
  return scrapedItems;
}

module.exports = { scrapeWithPlaywright };
