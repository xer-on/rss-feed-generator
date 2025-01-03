import { IRouter, Request, Response, Router } from "express";
import { RssController } from "../controllers/rss.controllers";

const router: IRouter = Router();

// Simple root route
router.get("/", (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const entertainmentUrl = `${baseUrl}/btb/entertainment`;
  const sportUrl = `${baseUrl}/btb/sport`;
  const nationalUrl = `${baseUrl}/btb/national`;
  const politicsUrl = `${baseUrl}/btb/politics`;
  const foreignUrl = `${baseUrl}/btb/foreign`;
  res.send(`
    <h1>Available RSS feeds:</h1>
    <ul>
      <li><a href="${entertainmentUrl}">${entertainmentUrl}</a></li>
      <li><a href="${sportUrl}">${sportUrl}</a></li>
      <li><a href="${nationalUrl}">${nationalUrl}</a></li>
      <li><a href="${politicsUrl}">${politicsUrl}</a></li>
      <li><a href="${foreignUrl}">${foreignUrl}</a></li>
    </ul>
  `);
});

// Generic feed route
// router.get("/:website/:category", RssController.getFeed);

// Specific routes
router.get("/btb/entertainment", RssController.getEntertainmentFeed);
router.get("/btb/sport", RssController.getSportFeed);
router.get("/btb/national", RssController.getNationalFeed);
router.get("/btb/politics", RssController.getPoliticsFeed);
router.get("/btb/foreign", RssController.getForeignFeed);

export default router;
