/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright'); // Requires playwright to be installed 
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');
const BROLL_DIR = path.join(OUTPUT_DIR, 'broll');
const SCREENSHOTS_DIR = path.join(OUTPUT_DIR, 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(BROLL_DIR)) fs.mkdirSync(BROLL_DIR, { recursive: true });
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

(async () => {
  console.log('🎬 Starting Aegis Intercept Demo Automation & Capture...');
  console.log('Make sure your Next.js server is running on http://localhost:3000!');
  console.log('--------------------------------------------------');

  // Launch browser (headless: false so we can watch and record)
  const browser = await chromium.launch({ headless: false });
  
  // Create a new context with a standard desktop viewport and video recording
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    recordVideo: {
      dir: BROLL_DIR,
      size: { width: 1280, height: 800 }
    }
  });
  
  const page = await context.newPage();

  try {
    // 1. Go to homepage
    console.log('📍 [0:00] Navigating to Dashboard...');
    await page.goto('http://localhost:3000');

    await page.waitForTimeout(5000); 
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_dashboard_overview.png') });
    console.log('📸 Captured dashboard overview screenshot');

    console.log('⏳ Waiting 20 seconds for introduction (Hook & Intro)...');
    await page.waitForTimeout(20000); // 20s introduction

    // 2. Simulate the Attack
    console.log('🚨 [0:25] Triggering "Simulate Exploit"...');
    await page.click('text=Simulate Exploit');

    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_exploit_simulation.png') });
    console.log('📸 Captured exploit simulation screenshot');

    console.log('⏳ Waiting 13 seconds to let the threat pulse on screen...');
    await page.waitForTimeout(13000);

    // 3. Mitigate the Attack
    console.log('🛡️ [0:40] Triggering "Front-Run & Pause Contract"...');
    await page.click('text=Front-Run & Pause Contract');

    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_threat_mitigated.png') });
    console.log('📸 Captured mitigated threat screenshot');

    console.log('⏳ Waiting 12 seconds while the warning transitions to MITIGATED...');
    await page.waitForTimeout(12000);

    // 4. Go to Exploit Replay
    console.log('⏪ [0:55] Navigating to "Exploit Replay"...');
    await page.click('text=Exploit Replay');

    // Wait for the page to transition
    await page.waitForTimeout(2000);

    // 5. Play the Timeline
    console.log('▶️ [0:57] Pressing "Play" on the timeline scrubber...');
    
    // Target the play button specifically (the middle icon button in the dock without text)
    // There are 3 buttons: skip back, play/pause, skip forward. We select the middle one.
    const playButton = page.locator('button.rounded-full.shadow-lg').first();
    await playButton.click();

    await page.waitForTimeout(5000);
    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_exploit_replay.png') });
    console.log('📸 Captured exploit replay playback screenshot');

    console.log('⏳ Letting the replay finish (approx 13 seconds)...');
    await page.waitForTimeout(13000);

    console.log('✅ Demo sequence complete! B-roll and screenshots saved to scripts/output/');

  } catch (error) {
    console.error('❌ Error during sequence:', error);
  } finally {
    // Leave the browser open for 5 seconds to let user hit "stop recording" 
    // before closing everything
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();
