export class ProductPage {
    constructor(page) {
        this.page = page;
        this.imageLayoutShoes = page.locator('#ec_product_image_effect_4481370');
        this.currency = page.locator('#ec_currency_conversion');
        this.manufacterer = page.getByRole('link', { name: 'DNK' });
    }


    async openImageLayoutShoes() {
        await this.imageLayoutShoes.click();
    }

    async currencyChangeAttempt() {
        await this.currency.selectOption('EUR');
    }

    async goToManufacterer() {
        await this.manufacterer.click();
    }

}