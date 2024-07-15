import { Browser, Page, BrowserLaunchArgumentOptions, KeyInput } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import path from 'path'

const DEFAULT_VIEWPORT = {
    width: 1280,
    height: 960,
}

export class MyProfile {
    private browser?: Browser

    constructor() {
        puppeteer.use(StealthPlugin());
    }

    async create() {
        const executablePath = path.join(__dirname, 'resouce','125', 'chrome.exe');

        await puppeteer.launch({
            executablePath: executablePath,
            headless: false,
            defaultViewport: DEFAULT_VIEWPORT,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ['--enable-automation', '--disable-extensions', '--enable-blink-features=IdleDetection']
        })
        .then(async browser => {
            this.browser = browser;
            const page = await browser.newPage()
                await page.goto('https://traodoisub.com')
                // await setTimeout(5000);
                // await page.screenshot({ path: 'stealth.png', fullPage: true })
                // await browser.close()
        });
        
    }


}