/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * capture-broll.js
 * ────────────────
 * Records B-roll video clips of the Aegis Intercept dashboard in action.
 * Produces WebP-compatible video segments for README embedding and social media.
 * Output → scripts/output/broll/  (gitignored)
 *
 * Usage:
 *   node scripts/capture-broll.js
 *
 * Prerequisites:
 *   - Next.js dev server running on http://localhost:3000
 *   - npx playwright install chromium  (one-time browser install)
 *
 * Output Files:
 *   01_dashboard_overview.webm    — 12s hero reel of live dashboard
 *   02_exploit_simulation.webm    — 15s exploit trigger → RED ALERT → mitigation
 *   03_exploit_replay.webm        — 20s replay player walk-through
 *   04_benchmark_closeup.webm     — 10s latency chart live data stream
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'output', 'broll');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const VIEWPORT = { width: 1280, height: 800 };

/**
 * Helper: Start recording a video context and return the page.
 * Playwright records video per-context, so we create a fresh context per clip.
 */
async function createRecordingContext(browser, filename) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    colorScheme: 'dark',
    recordVideo: {
      dir: OUTPUT_DIR,
      size: VIEWPORT,
    },
  });
  const page = await context.newPage();
  // Store the target filename for later rename
  page._targetFilename = filename;
  page._context = context;
  return page;
}

/**
 * Helper: Stop recording and rename the auto-generated file to our target name.
 */
async function finalizeRecording(page) {
  const video = page.video();
  await page.close();
  await page._context.close();

  if (video) {
    const autoPath = await video.path();
    const targetPath = path.join(OUTPUT_DIR, page._targetFilename);

    // Playwright saves as .webm — rename to our desired filename
    if (fs.existsSync(autoPath)) {
      fs.renameSync(autoPath, targetPath);
      console.log(`   ✅ ${page._targetFilename}`);
    } else {
      console.log(`   ⚠️  Video file not found at ${autoPath}`);
    }
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('🎬 Aegis Intercept — B-Roll Capture');
  console.log(`   Output → ${OUTPUT_DIR}`);
  console.log(`   Target → ${BASE_URL}`);
  console.log('─'.repeat(50));

  const browser = await chromium.launch({ headless: true });

  try {
    // ── CLIP 1: Dashboard Overview (12s hero reel) ─────────────
    console.log('');
    console.log('🎥 [1/4] Dashboard Overview — 12s hero reel...');
    {
      const page = await createRecordingContext(browser, '01_dashboard_overview.webm');
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000); // Let animations settle

      // Let the live benchmark chart stream data for ~9s
      await page.waitForTimeout(9000);

      await finalizeRecording(page);
    }

    // ── CLIP 2: Exploit Simulation (15s) ───────────────────────
    console.log('🎥 [2/4] Exploit Simulation — trigger → alert → mitigate...');
    {
      const page = await createRecordingContext(browser, '02_exploit_simulation.webm');
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Trigger the exploit
      const simulateBtn = page.getByText('Simulate Exploit');
      if (await simulateBtn.isVisible()) {
        await simulateBtn.click();
        console.log('   🚨 Exploit triggered');
        await page.waitForTimeout(5000); // RED ALERT on screen

        // Attempt mitigation
        const pauseBtn = page.getByText('Front-Run & Pause Contract');
        if (await pauseBtn.isVisible()) {
          await pauseBtn.click();
          console.log('   🛡️ Mitigation fired');
          await page.waitForTimeout(4000); // Watch transition to MITIGATED
        }
      }

      await page.waitForTimeout(2000); // Extra buffer
      await finalizeRecording(page);
    }

    // ── CLIP 3: Exploit Replay (20s) ───────────────────────────
    console.log('🎥 [3/4] Exploit Replay — full timeline walk-through...');
    {
      const page = await createRecordingContext(browser, '03_exploit_replay.webm');
      await page.goto(`${BASE_URL}/replay`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Start the replay
      const playButton = page.locator('button.rounded-full.shadow-lg').first();
      if (await playButton.isVisible()) {
        await playButton.click();
        console.log('   ▶️ Replay started');
        await page.waitForTimeout(16000); // Let it play through
      }

      await page.waitForTimeout(2000);
      await finalizeRecording(page);
    }

    // ── CLIP 4: Benchmark Close-up (10s) ───────────────────────
    console.log('🎥 [4/4] Benchmark Close-up — live latency chart...');
    {
      const page = await createRecordingContext(browser, '04_benchmark_closeup.webm');
      await page.goto(BASE_URL, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000);

      // Scroll to the benchmark chart section
      await page.evaluate(() => {
        const heading = [...document.querySelectorAll('h3')].find(h =>
          h.textContent?.includes('Network Discovery Horizon')
        );
        if (heading) heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      await page.waitForTimeout(1000);

      // Record the live data streaming in
      await page.waitForTimeout(8000);
      await finalizeRecording(page);
    }

    console.log('');
    console.log('─'.repeat(50));
    console.log(`✅ All B-roll clips saved to: ${OUTPUT_DIR}`);
    console.log('');
    console.log('💡 To convert .webm → .gif for README:');
    console.log('   ffmpeg -i clip.webm -vf "fps=12,scale=720:-1" -loop 0 clip.gif');
    console.log('');
    console.log('💡 To convert .webm → .webp for README:');
    console.log('   ffmpeg -i clip.webm -vcodec libwebp -lossless 0 -q:v 50 -loop 0 -preset default -an -vsync 0 clip.webp');
    console.log('');
    console.log('   These files are gitignored — commit-safe.');

  } catch (err) {
    console.error('❌ B-roll capture failed:', err.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
