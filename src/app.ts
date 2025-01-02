import express, { Request, Response, NextFunction } from 'express';
const { Feed } = require('feed');
const cheerio = require('cheerio');
const axios = require('axios');
const app = express();
const crypto = require('crypto');

// Add this interface at the top of the file
interface NewsItem {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  imageUrl: string;
  date: Date;
}

// Function to parse the HTML and extract news items
function parseNewsData(htmlContent: string) {
  const $ = cheerio.load(htmlContent);
  const newsItems: NewsItem[] = [];

//   console.log('Found elements:', $('.contents .each').length);

  $('.contents .each').each((i: number, element: cheerio.Element) => {
    const $element = $(element);
    
    const title = $element.find('.title').text().trim();
    const subtitle = $element.find('.subtitle').text().trim();
    const description = $element.find('.summery').text().trim();
    const link = $element.find('.link_overlay').attr('href');
    const imageUrl = $element.find('img').attr('src');
    
    // console.log('Parsing item:', {
    //   title,
    //   subtitle,
    //   description,
    //   link,
    //   imageUrl
    // });

    if (title && link) {
      const fullLink = link.startsWith('//') ? `https:${link}` : link;
      const fullImageUrl = imageUrl?.startsWith('//') ? `https:${imageUrl}` : imageUrl;

      newsItems.push({
        title,
        subtitle,
        description,
        link: fullLink,
        imageUrl: fullImageUrl,
        date: new Date()
      });
    }
  });

  console.log('Total news items parsed:', newsItems.length);
  return newsItems;
}

// Configure and generate RSS feed
function generateFeed(newsItems: NewsItem[]) {
  const now = new Date();
  let atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Bangla Tribune News</title>
  <id>https://www.banglatribune.com/</id>
  <updated>${now.toISOString()}</updated>
  <link href="https://www.banglatribune.com" />
  <link href="https://www.banglatribune.com/feed" rel="self" />`;

  // Add items to feed
  newsItems.forEach(item => {
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
      ${item.subtitle ? `<h2>${item.subtitle}</h2>` : ''}
      ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}"/>` : ''}
      <p>${item.description}</p>
    </content>
  </entry>`;
  });

  atomFeed += '\n</feed>';
  return atomFeed;
}

// Add request logging middleware


// Add a basic root route to test
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running. Visit /rss for the RSS feed.');
});

// RSS feed endpoint with dynamic URL parameter
app.get('/rss/*', async (req: Request, res: Response): Promise<void> => {
  try {
    // Get the full URL by removing '/rss/' from the original path
    const url = req.originalUrl.replace('/rss/', '');
    console.log('Received request for RSS feed with URL:', url);
    
    // Validate URL
    try {
      new URL(url);
    } catch (e) {
      res.status(400).send('Invalid URL provided');
      // return;
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

// Add error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});