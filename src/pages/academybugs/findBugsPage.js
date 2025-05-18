export class FindBugsPage {
    constructor(page) {
        this.page = page;
        this.overlayWithFoundBug = page.locator('.academy-bug-overlay');
        this.modalWindowAboutBug = page.getByRole('heading',  { name: 'What did you find out?' });
        this.popupWithFoundBug = page.getByRole('heading', { name: 'You found a “Crash” bug' });
        this.bugCounter = page.getByRole('link', { name: '' });
        this.numberBugs = page.getByText('You found 1 bug out of 25 1 2');
    }

    async open(url) {
        await this.page.goto(url);
    }

    async goToBugCounter() {
        await this.bugCounter.click();
    }
}