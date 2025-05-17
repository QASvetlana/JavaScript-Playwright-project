export class CartPage {
    constructor(page) {
        this.page = page;
        this.deleteFromCard = page.locator('.ec_cartitem_delete');
        this.home = page.getByRole('link', { name: 'RETURN TO STOR      E' });
    }


    async btnDeleteFromCard() {
        await this.deleteFromCard.click();
    }

    async returnHome() {
        await this.home.click();
    }

}