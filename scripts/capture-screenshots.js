/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * capture-screenshots.js
 * ──────────────────────
 * Captures high-resolution still screenshots of every key Aegis Intercept view.
 * Output → scripts/output/screenshots/  (gitignored)
 *
 * Usage:
 *   node scripts/capture-screenshots.js
 *
 * Prerequisites:
 *   - Next.js dev server running on http://localhost:3000
 *   - npx playwright install chromium  (one-time browser install)
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'output', 'screenshots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const VIEWPORT = { width: 1440, height: 900 };

async function main() {
  // Ensure output directory exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('📸 Aegis Intercept — Screenshot Capture');
  console.log(`   Output → ${OUTPUT_DIR}`);
  console.log(`   Target → ${BASE_URL}`);
  console.log('─'.repeat(50));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // Retina 2x for crisp screenshots
    colorScheme: 'dark',
  });
  const page = await context.newPage();

  try {
    // ── 1. Dashboard — Clean State ─────────────────────────────
    console.log('📍 [1/6] Dashboard — clean state...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); // Let animations settle
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '01_dashboard_clean.png'),
      fullPage: false,
    });
    console.log('   ✅ 01_dashboard_clean.png');

    // ── 2. Dashboard — Full Page (scrolled) ────────────────────
    console.log('📍 [2/6] Dashboard — full page...');
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '02_dashboard_fullpage.png'),
      fullPage: true,
    });
    console.log('   ✅ 02_dashboard_fullpage.png');

    // ── 3. Dashboard — After Exploit Trigger ───────────────────
    console.log('📍 [3/6] Triggering exploit simulation...');
    const simulateBtn = page.getByText('Simulate Exploit');
    if (await simulateBtn.isVisible()) {
      await simulateBtn.click();
      await page.waitForTimeout(2000); // Let RED ALERT animate in
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '03_exploit_triggered.png'),
        fullPage: false,
      });
      console.log('   ✅ 03_exploit_triggered.png');
    } else {
      console.log('   ⚠️  Simulate button not found, skipping...');
    }

    // ── 4. Dashboard — After Mitigation ────────────────────────
    console.log('📍 [4/6] Attempting mitigation...');
    const pauseBtn = page.getByText('Front-Run & Pause Contract');
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '04_exploit_mitigated.png'),
        fullPage: false,
      });
      console.log('   ✅ 04_exploit_mitigated.png');
    } else {
      console.log('   ⚠️  Pause button not visible (no critical alert), skipping...');
    }

    // ── 5. Exploit Replay — Overview ───────────────────────────
    console.log('📍 [5/6] Navigating to Exploit Replay...');
    await page.goto(`${BASE_URL}/replay`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, '05_replay_overview.png'),
      fullPage: false,
    });
    console.log('   ✅ 05_replay_overview.png');

    // ── 6. Replay — Mid-exploit (step 3–4) ─────────────────────
    console.log('📍 [6/6] Advancing replay to critical step...');
    // Click the play button to start, then wait for it to advance
    const playButton = page.locator('button.rounded-full.shadow-lg').first();
    if (await playButton.isVisible()) {
      await playButton.click();
      await page.waitForTimeout(6000); // Let it advance a few steps
      // Pause playback
      await playButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(OUTPUT_DIR, '06_replay_critical_step.png'),
        fullPage: false,
      });
      console.log('   ✅ 06_replay_critical_step.png');
    } else {
      console.log('   ⚠️  Play button not found, skipping...');
    }

    console.log('');
    console.log('─'.repeat(50));
    console.log(`✅ All screenshots saved to: ${OUTPUT_DIR}`);
    console.log('   These files are gitignored — commit-safe.');

  } catch (err) {
    console.error('❌ Screenshot capture failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
