import { IRouter, Request, Response, Router } from "express";
import { RssController } from "../controllers/rss.controllers";

const router: IRouter = Router();

// Feed configuration
const feeds = [
  { path: 'entertainment', handler: RssController.getEntertainmentFeed },
  { path: 'sport', handler: RssController.getSportFeed },
  { path: 'national', handler: RssController.getNationalFeed },
  { path: 'politics', handler: RssController.getPoliticsFeed },
  { path: 'foreign', handler: RssController.getForeignFeed },
];

// Simple root route
router.get("/", (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const feedLinks = feeds.map(feed => {
    const url = `${baseUrl}/btb/${feed.path}`;
    return `<li><a href="${url}">${url}</a></li>`;
  }).join('\n');

  res.send(`
    <h1>Available RSS feeds:</h1>
    <ul>
      ${feedLinks}
    </ul>
  `);
});

// Register routes dynamically
feeds.forEach(feed => {
  router.get(`/btb/${feed.path}`, feed.handler);
});

export default router;
