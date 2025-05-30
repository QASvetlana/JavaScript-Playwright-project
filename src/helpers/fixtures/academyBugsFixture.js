import { test as base } from '@playwright/test';
import { App } from '../../../src/pages/academybugs/appPage';


export const test = base.extend({
    app: async({ page }, use) => {
        const app = new App(page);
        await page.goto('https://academybugs.com/find-bugs/');
        await use(app);
    }
});