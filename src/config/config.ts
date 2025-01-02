import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(process.cwd(), ".env") });

// Validate required environment variables
if (!process.env || Object.keys(process.env).length === 0) {
  console.warn(`Warning: No environment variables found!`);
  console.warn(`Make sure your .env file exists in the project root directory`);
  console.warn(`Example .env format:`);
  console.warn(`WEBSITE_CATEGORY=https://example.com/path`);
}

// Get all website URLs from environment variables with validation
const getWebsiteUrls = () => {
  const urls = new Map<string, Map<string, string>>();
  
  console.log("Loading environment variables...");
  
  Object.entries(process.env).forEach(([key, value]) => {
    if (!value) return; // Skip undefined values
    
    const [website, category] = key.toLowerCase().split("_");
    
    if (!urls.has(website)) {
      urls.set(website, new Map());
    }
    
    urls.get(website)?.set(category, value);
    console.log(`Loaded URL mapping: ${website}/${category} -> ${value}`);
  });
  
  if (urls.size === 0) {
    console.warn("No website URLs found in environment variables!");
    console.warn("Make sure your .env file exists and contains variables like:");
  }
  
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
