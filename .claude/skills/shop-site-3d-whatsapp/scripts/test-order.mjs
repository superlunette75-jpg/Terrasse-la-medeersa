// Phone + desktop check of a built site: screenshots and a full WhatsApp order.
// Usage: node test-order.mjs <url> <out_dir>
//   (start `npx vite preview --port 4173` in the project first)
// Prints the decoded WhatsApp message and any console errors.
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = await import('/opt/node22/lib/node_modules/playwright/index.mjs'); }
const { chromium, devices } = pw;
const [url = 'http://localhost:4173/', out = './shots/'] = process.argv.slice(2);
const S = out.endsWith('/') ? out : out + '/';
await import('fs').then((fs) => fs.mkdirSync(S, { recursive: true }));

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'], geolocation: { latitude: 31.6347, longitude: -8.0103 }, permissions: ['geolocation'] });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
page.on('pageerror', (e) => errors.push(String(e)));
let waUrl = '';
ctx.on('page', (p) => { waUrl = p.url(); });

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: S + 'm-hero.png' });
const width = await page.evaluate(() => document.documentElement.scrollWidth);
if (width > 390) errors.push(`horizontal overflow: page is ${width}px wide on a 390px phone`);
for (const id of ['about', 'top-sellers', 'menu', 'delivery']) {
  await page.evaluate((id) => document.getElementById(id)?.scrollIntoView(), id);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: S + `m-${id}.png` });
}

// order: first two items of the menu, first chip of each option group
await page.evaluate(() => document.getElementById('menu').scrollIntoView());
await page.waitForTimeout(800);
const items = page.locator('#menu button[aria-label^="Add "]');
for (const i of [0, 1]) {
  await items.nth(i).click();
  await page.waitForTimeout(600);
  const extra = page.locator('fieldset').last().locator('button').first();
  if (i === 0 && (await extra.count())) await extra.click();
  if (i === 1) await page.getByRole('button', { name: 'More' }).click();
  if (i === 0) await page.screenshot({ path: S + 'm-sheet.png' });
  await page.getByRole('button', { name: /^Add · / }).click();
  await page.waitForTimeout(600);
}
await page.screenshot({ path: S + 'm-bar.png' });
await page.getByRole('button', { name: /View order/ }).click();
await page.waitForTimeout(700);
await page.getByRole('button', { name: /Send order on WhatsApp/ }).click(); // should show required-field errors
await page.waitForTimeout(400);
await page.screenshot({ path: S + 'm-cart-errors.png' });
await page.locator('[role=dialog] .grid-cols-2 button').first().click(); // first delivery zone
await page.getByPlaceholder('Name').fill('Test Client');
await page.getByPlaceholder(/Phone/).fill('0612345678');
await page.getByPlaceholder(/Address/).fill('Test address, blue door');
await page.getByRole('button', { name: /Share my location/ }).click();
await page.waitForTimeout(800);
await page.screenshot({ path: S + 'm-cart.png' });
await page.getByRole('button', { name: /Send order on WhatsApp/ }).click();
await page.waitForTimeout(1500);
await page.screenshot({ path: S + 'm-sent.png' });
const m = waUrl.match(/text=([^&]*)/);
console.log('--- WhatsApp message ---\n' + (m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : 'NOT SENT: ' + waUrl));

const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await d.goto(url, { waitUntil: 'networkidle' });
await d.waitForTimeout(1500);
await d.screenshot({ path: S + 'd-hero.png' });
for (const id of ['about', 'top-sellers', 'menu', 'delivery']) {
  await d.evaluate((id) => document.getElementById(id)?.scrollIntoView(), id);
  await d.waitForTimeout(1200);
  await d.screenshot({ path: S + `d-${id}.png` });
}
console.log('--- errors ---\n' + (errors.length ? errors.join('\n') : 'none'));
await browser.close();
