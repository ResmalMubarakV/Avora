/**
 * Reserved Usernames Collection
 * A Set of restricted usernames to prevent frontend routing conflicts, 
 * system administrator impersonation, and abuse of core application endpoints.
 * 
 * Note: Using a Set provides O(1) lookup time during user registration validation.
 * 
 * @type {Set<string>}
 */
const reservedUsernames = new Set([
  "admin",
  "administrator",
  "login",
  "register",
  "dashboard",
  "api",
  "settings",
  "profile",
  "about",
  "contact",
  "privacy",
  "terms",
  "explore",
  "discover",
  "search",
  "memories",
  "memory",
  "notifications",
  "messages",
  "chat",
  "saved",
  "favorites",
  "bookmarks",
  "support",
  "help",
  "pricing",
  "features",
  "careers",
  "jobs",
  "status",
  "docs",
  "robots.txt",
  "favicon.ico"
]);

module.exports = { reservedUsernames };