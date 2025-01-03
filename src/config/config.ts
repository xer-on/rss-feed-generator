import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get all website URLs from environment variables
const getWebsiteUrls = () => {
  const urls = new Map<string, Map<string, string>>();

  Object.entries(process.env).forEach(([key, value]) => {
    const [website, category] = key.toLowerCase().split("_");

    if (!urls.has(website)) {
      urls.set(website, new Map());
    }

    urls.get(website)?.set(category, value!);
    console.log(`Loaded URL mapping: ${website}/${category} -> ${value}`);
  });

  return urls;
};

// Initialize URLs lazily when first needed
let websiteUrls: Map<string, Map<string, string>>;

export const getUrls = () => {
  if (!websiteUrls) {
    websiteUrls = getWebsiteUrls();
  }
  return websiteUrls;
};
