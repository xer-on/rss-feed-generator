import { Router, Request, Response } from 'express';
import axios from 'axios';
import { parseNewsData, generateFeed } from '../services/rss.services';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send('Server is running. Visit /rss for the RSS feed.');
});

router.get('/rss/*', async (req: Request, res: Response): Promise<void> => {
  try {
    const url = req.originalUrl.replace('/rss/', '');
    console.log('Received request for RSS feed with URL:', url);
    
    try {
      new URL(url);
    } catch (e) {
      res.status(400).send('Invalid URL provided');
      return;
    }

    const response = await axios.get(url);
    const htmlContent = response.data;
    const newsItems = parseNewsData(htmlContent);
    const feed = generateFeed(newsItems);
    
    res.set('Content-Type', 'application/atom+xml; charset=utf-8');
    res.send(feed);
  } catch (error) {
    console.error('Error in feed generation:', error);
    res.status(500).send('Error generating feed');
  }
});

export default router;
