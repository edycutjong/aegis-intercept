/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright'); // Requires playwright to be installed 

(async () => {
  console.log('🎬 Starting Aegis Intercept Demo Automation...');
  console.log('Make sure your Next.js server is running on http://localhost:3000!');
  console.log('--------------------------------------------------');

  // Launch browser (headless: false so we can watch and record)
  const browser = await chromium.launch({ headless: false });
  
  // Create a new context with a standard desktop viewport
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  
  const page = await context.newPage();

  try {
    // 1. Go to homepage
    console.log('📍 [0:00] Navigating to Dashboard...');
    await page.goto('http://localhost:3000');

    console.log('⏳ Waiting 25 seconds for introduction (Hook & Intro)...');
    await page.waitForTimeout(25000); // 25s introduction

    // 2. Simulate the Attack
    console.log('🚨 [0:25] Triggering "Simulate Exploit"...');
    await page.click('text=Simulate Exploit');

    console.log('⏳ Waiting 15 seconds to let the threat pulse on screen...');
    await page.waitForTimeout(15000);

    // 3. Mitigate the Attack
    console.log('🛡️ [0:40] Triggering "Front-Run & Pause Contract"...');
    await page.click('text=Front-Run & Pause Contract');

    console.log('⏳ Waiting 15 seconds while the warning transitions to MITIGATED...');
    await page.waitForTimeout(15000);

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

    console.log('⏳ Letting the replay finish (approx 18 seconds)...');
    await page.waitForTimeout(18000);

    console.log('✅ Demo sequence complete! Make sure you captured the recording.');

  } catch (error) {
    console.error('❌ Error during sequence:', error);
  } finally {
    // Leave the browser open for 5 seconds to let user hit "stop recording" 
    // before closing everything
    await page.waitForTimeout(5000);
    await browser.close();
  }
})();
