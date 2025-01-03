import { Request, Response } from "express";
import { getFeed } from "../services/rss.services";

const handleResponse = (res: Response, feed: string) => {
  res.set("Content-Type", "application/atom+xml; charset=utf-8");
  res.send(feed);
};

const handleError = (res: Response, error: any, category: string) => {
  console.error(`Error fetching ${category} news:`, {
    message: error.message,
    stack: error.stack,
    response: error.response?.data,
  });
  res.status(500).send(`Error fetching ${category} news: ${error.message}`);
};

const createFeedHandler = (category: string, envVar: string) => {
  return async (req: Request, res: Response) => {
    try {
      const feed = await getFeed(envVar);
      handleResponse(res, feed);
    } catch (error: any) {
      handleError(res, error, category);
    }
  };
};

export const RssController = {
  getEntertainmentFeed: createFeedHandler(
    "entertainment",
    "BANGLATRIBUNE_ENTERTAINMENT"
  ),
  getSportFeed: createFeedHandler("sport", "BANGLATRIBUNE_SPORT"),
  getNationalFeed: createFeedHandler("national", "BANGLATRIBUNE_NATIONAL"),
  getPoliticsFeed: createFeedHandler("politics", "BANGLATRIBUNE_POLITICS"),
  getForeignFeed: createFeedHandler("foreign", "BANGLATRIBUNE_FOREIGN"),
};
