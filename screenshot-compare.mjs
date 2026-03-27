import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screensDir = path.join(__dirname, 'public/screens');
const outDir = path.join(__dirname, 'screenshots');

const refs = [
  { name: '4-loading', file: '4-loading.html' },
  { name: '3-phone', file: '3-phone.html' },
  { name: '2-name', file: '2-name.html' },
  { name: '1-splash', file: '1-splash.html' },
];

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } }); // iPhone 14

  // Screenshot reference HTML files
  for (const ref of refs) {
    const page = await context.newPage();
    const filePath = `file://${path.join(screensDir, ref.file)}`;
    await page.goto(filePath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // let images load
    await page.screenshot({ path: path.join(outDir, `ref-${ref.name}.png`), fullPage: false });
    await page.close();
    console.log(`✓ ref-${ref.name}.png`);
  }

  // Screenshot React app scenes
  // Loading scene - navigate through intro → input → loading
  const appPage = await context.newPage();
  await appPage.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await appPage.waitForTimeout(3000); // wait for intro animation
  await appPage.screenshot({ path: path.join(outDir, `app-1-splash.png`), fullPage: false });
  console.log('✓ app-1-splash.png');

  // Click begin button
  const beginBtn = appPage.locator('button:has-text("begin")');
  if (await beginBtn.isVisible()) {
    await beginBtn.click();
    await appPage.waitForTimeout(1000);
    await appPage.screenshot({ path: path.join(outDir, `app-2-name.png`), fullPage: false });
    console.log('✓ app-2-name.png');

    // Type name and click NEXT
    await appPage.fill('input[name="fullName"]', 'Avery');
    await appPage.waitForTimeout(500);
    await appPage.screenshot({ path: path.join(outDir, `app-2-name-filled.png`), fullPage: false });
    console.log('✓ app-2-name-filled.png');

    await appPage.click('button:has-text("NEXT")');
    await appPage.waitForTimeout(1000);
    await appPage.screenshot({ path: path.join(outDir, `app-3-phone.png`), fullPage: false });
    console.log('✓ app-3-phone.png');

    // Type phone and submit
    await appPage.fill('input[name="phone"]', '5551234567');
    await appPage.waitForTimeout(500);
    await appPage.click('button:has-text("read me")');
    await appPage.waitForTimeout(2000);
    await appPage.screenshot({ path: path.join(outDir, `app-4-loading.png`), fullPage: false });
    console.log('✓ app-4-loading.png');
  }

  await browser.close();
  console.log('\nDone! Screenshots saved to:', outDir);
}

run().catch(console.error);
