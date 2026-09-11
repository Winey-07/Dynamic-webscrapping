// ==========================================
// urlNormalizer.js
// Standardizes URLs to prevent duplicate entries
// ==========================================

function normalizeUrl(rawUrl) {
  try {
    // Parse the URL
    const url = new URL(rawUrl);

    // Remove hash fragment (e.g., #section-1)
    url.hash = "";

    // Remove trailing slash from pathname (e.g., /article/ -> /article)
    // unless it's the root path
    if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      url.pathname = url.pathname.slice(0, -1);
    }

    // Convert hostname to lowercase
    url.hostname = url.hostname.toLowerCase();

    return url.href;
  } catch (error) {
    // If the URL is invalid, return the original string
    return rawUrl;
  }
}

module.exports = { normalizeUrl };
