
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {setTimeout} from "node:timers/promises";

export class TDSWorker {
    constructor() {
        puppeteer.use(StealthPlugin());
    }

    async Execute() {
        console.log("Execute");
        this.OpenBrowser();
    } 

    async Stop () {

    }

    async OpenBrowser() {
        puppeteer.launch({ headless: false }).then(async browser => {
            const page = await browser.newPage()
                await page.goto('https://traodoisub.com')
                // await setTimeout(5000);
                // await page.screenshot({ path: 'stealth.png', fullPage: true })
                // await browser.close()
        })
    } 
}