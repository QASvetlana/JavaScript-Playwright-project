export class GlobalfeedPage {
    constructor(page) {
        this.page = page;
        this.heartButton = page.locator(`(//i[contains(@class,"ion-heart")])[1]`);
        this.heartCounter = page.locator(`(//span[contains(@class,"counter")])[1]`); 
    }

    async clicktoheartButton() {
        await this.heartButton.click();
    }
}