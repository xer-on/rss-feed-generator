import axios from "axios";
import { IRouter, Request, Response, Router } from "express";
import { generateFeed, parseNewsData } from "../services/rss.services";
import { getUrls } from "../config/config";

const router: IRouter = Router();

router.get("/", (req: Request, res: Response) => {
  const urls = getUrls();
  const availableRoutes = Array.from(urls.entries()).map(([website, categories]) => {
    return `${website}: ${Array.from(categories.keys()).join(", ")}`;
  });
  res.send(`Server is running. Available routes:\n${availableRoutes.join("\n")}`);
});

router.get(
  "/:website/:category",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { website, category } = req.params;
      const urls = getUrls();
      
      const websiteUrls = urls.get(website.toLowerCase());
      if (!websiteUrls) {
        res.status(404).send(
          `Website '${website}' not found. Available websites: ${Array.from(urls.keys()).join(", ")}`
        );
        return;
      }

      const url = websiteUrls.get(category.toLowerCase());
      if (!url) {
        res.status(404).send(
          `Category '${category}' not found for ${website}. Available categories: ${Array.from(websiteUrls.keys()).join(", ")}`
        );
        return;
      }

      console.log(`Fetching feed - Website: ${website}, Category: ${category}, URL: ${url}`);

      const response = await axios.get(url);
      const htmlContent = response.data;
      const newsItems = parseNewsData(htmlContent);
      const feed = generateFeed(newsItems);

      res.set("Content-Type", "application/atom+xml; charset=utf-8");
      res.send(feed);
    } catch (error) {
      console.error("Error in feed generation:", error);
      res.status(500).send("Error generating feed");
    }
  }
);

export default router;
