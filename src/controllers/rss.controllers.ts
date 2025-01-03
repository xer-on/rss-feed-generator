import axios from "axios";
import { Request, Response } from "express";
import { generateFeed, parseNewsData } from "../services/rss.services";

const getFeed = async (urlEnvVar: string) => {
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

const getEntertainmentFeed = async (req: Request, res: Response) => {
  try {
    const feed = await getFeed("BTB_ENTERTAINMENT");
    res.set("Content-Type", "application/atom+xml; charset=utf-8");
    res.send(feed);
  } catch (error: any) {
    console.error("Error fetching entertainment news:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).send(`Error fetching entertainment news: ${error.message}`);
  }
};

export const RssController = {
  getEntertainmentFeed,
};
