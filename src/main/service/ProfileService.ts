import { Browser, Page, BrowserLaunchArgumentOptions, KeyInput } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import path from 'path'
import { app } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from './DatabaseService';
import { Profile } from '../model/Profile';

const DEFAULT_VIEWPORT = {
    width: 1280,
    height: 960,
}

export class ProfileService {
    private browser?: Browser
    private dbService = DatabaseService.getInstance();


    constructor() {
        puppeteer.use(StealthPlugin());
    }

    async create(profile: Profile) {
        // await this.createChromiumProfile(profile.id);
       
        return this.dbService.createProfile(profile);
    }

    async getAll() {
        return this.dbService.getAllProfiles();
    }

    private async createChromiumProfile(profileID: string) {
        const executablePath = path.join(__dirname, 'resouce','125', 'chrome.exe');
        const dataPath = path.join(app.getPath('userData'), 'profile_saved', profileID);

        await puppeteer.launch({
            executablePath: executablePath,
            userDataDir: dataPath,
            headless: false,
            defaultViewport: DEFAULT_VIEWPORT,
            ignoreHTTPSErrors: true,
            ignoreDefaultArgs: ['--enable-automation', '--disable-extensions', '--enable-blink-features=IdleDetection']
        })
        .then(async browser => {
            // this.browser = browser;
            // const page = await browser.newPage()
            //     await page.goto('https://traodoisub.com')
                // await setTimeout(5000);
                // await page.screenshot({ path: 'stealth.png', fullPage: true })
                // await browser.close()

            
        });
    }
}