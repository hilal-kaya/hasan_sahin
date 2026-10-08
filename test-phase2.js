const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  
  await page.goto('http://127.0.0.1:8080', { waitUntil: 'networkidle0' });
  
  console.log("Checking Initial State...");
  const initialHeaderHeight = await page.evaluate(() => document.querySelector('.header-inner').offsetHeight);
  console.log(`Initial header-inner height: ${initialHeaderHeight}px`);
  
  // Scroll down
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 800)); // wait for transition
  
  const scrolledHeaderHeight = await page.evaluate(() => document.querySelector('.header-inner').offsetHeight);
  console.log(`Scrolled header-inner height: ${scrolledHeaderHeight}px`);
  
  // Check active navigation link
  const activeLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('nav a[aria-current="location"]')).map(a => a.textContent);
  });
  console.log(`Active navigation links: ${activeLinks.join(', ')}`);
  
  // Check reveal elements
  const revealedCount = await page.evaluate(() => document.querySelectorAll('.is-revealed').length);
  console.log(`Number of revealed elements: ${revealedCount}`);
  
  await page.close();
  browser.disconnect();
})();
