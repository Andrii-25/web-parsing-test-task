require("dotenv").config();
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const googleEmail = process.env.GOOGLE_EMAIL;
const googlePassword = process.env.GOOGLE_PASSWORD;

(async () => {
  const browser = await puppeteer.launch({
    headless: "new", // Launch Puppeteer in a new headless browser instance
    args: ["--no-sandbox", "--disable-gpu", "--enable-webgl"], // Additional commandline arguments for the browser
  });

  const page = await browser.newPage();

  try {
    await page.goto("https://mail.google.com", { waitUntil: "networkidle2" }); // Navigate to Gmail page and wait for resources to load

    await page.type('input[type="email"]', googleEmail); // Input the email address
    await page.click('div[id="identifierNext"]'); // Click the "Next" button after entering the email

    await page.waitForTimeout(5000); // Wait for 5 seconds

    await page.type('input[type="password"]', googlePassword); // Input the password
    await page.click('div[id="passwordNext"]'); // Click the "Next" button after entering the password

    await page.waitForNavigation({ waitUntil: "networkidle2" }); // Wait for navigation to complete

    const unreadCount = await page.evaluate(() => {
      const unreadElement = document.querySelector("div.bsU"); // Find the DOM element with the count of unread emails
      return unreadElement ? unreadElement.innerText : "0"; // Return the count of unread emails (or "0" if the element is not found)
    });

    console.log(`Number of unread emails: ${unreadCount}`); // Print the count of unread emails
  } catch (error) {
    console.error("An error occurred:", error); // Handle errors and print an error message
  } finally {
    await browser.close(); // Close the browser, even if an error occurred
  }
})();
