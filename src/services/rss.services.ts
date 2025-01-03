import axios from "axios";
import * as cheerio from "cheerio";
import crypto from "crypto";
import { NewsItem } from "../types/rss.types";

export function parseNewsData(htmlContent: string): NewsItem[] {
  const $ = cheerio.load(htmlContent);

  const newsItems: NewsItem[] = [];
  const elements = $(".contents .each");

  elements.each((i: number, element: cheerio.Element) => {
    const $element = $(element);

    const title = $element.find(".title").text().trim();
    const subtitle = $element.find(".subtitle").text().trim();
    const description = $element.find(".summery").text().trim();
    const link = $element.find(".link_overlay").attr("href");
    const imageUrl = $element.find("img").attr("src");

    if (title && link) {
      const fullLink = link.startsWith("//") ? `https:${link}` : link;
      const fullImageUrl = imageUrl?.startsWith("//")
        ? `https:${imageUrl}`
        : imageUrl;

      newsItems.push({
        title,
        subtitle,
        description,
        link: fullLink,
        imageUrl: fullImageUrl,
        date: new Date(),
      });
    }
  });

  console.log("Total news items parsed:", newsItems.length);
  return newsItems;
}

interface FeedOptions {
  title?: string;
  feedId?: string;
  baseUrl?: string;
}

export const getFeed = async (urlEnvVar: string) => {
  const url = process.env[urlEnvVar];
  if (!url) {
    throw new Error(`${urlEnvVar} environment variable is not defined`);
  }

  console.log(`Fetching RSS feed from: ${url}`);
  const response = await axios.get(url);
  console.log(`Response status: ${response.status}`);

  const htmlContent = response.data;
  const newsItems = parseNewsData(htmlContent);

  if (newsItems.length === 0) {
    console.warn("No news items were parsed from the content");
  }

  return generateFeed(newsItems);
};

export function generateFeed(newsItems: NewsItem[], options: FeedOptions = {}) {
  const {
    title = "Bangla Tribune News",
    feedId = "https://www.banglatribune.com/",
    baseUrl = "https://www.banglatribune.com",
  } = options;

  const now = new Date();
  let atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
  <feed xmlns="http://www.w3.org/2005/Atom">
    <title>${title}</title>
    <id>${feedId}</id>
    <updated>${now.toISOString()}</updated>
    <link href="${baseUrl}" />
    <link href="${baseUrl}/feed" rel="self" />`;

  // Add items to feed
  newsItems.forEach((item) => {
    const uuid = crypto.randomUUID();
    atomFeed += `
    <entry>
      <id>urn:uuid:${uuid}</id>
      <title>${item.title}</title>
      <published>${item.date.toISOString()}</published>
      <updated>${item.date.toISOString()}</updated>
      <author><name>Bangla Tribune</name></author>
      <link href="${item.link}" rel="alternate" />
      <summary>${item.description}</summary>
      <content type="html">
        ${item.subtitle ? `<h2>${item.subtitle}</h2>` : ""}
        ${
          item.imageUrl
            ? `<img src="${item.imageUrl}" alt="${item.title}"/>`
            : ""
        }
        <p>${item.description}</p>
      </content>
    </entry>`;
  });

  atomFeed += "\n</feed>";
  return atomFeed;
}
