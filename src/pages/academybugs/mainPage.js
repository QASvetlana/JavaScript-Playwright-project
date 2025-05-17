export class MainPage {
    constructor(page) {
        this.page = page;
        this.productsPerPage = page.getByRole('link',  { name: '50' });
        this.imageLayoutJeans = page.locator('#ec_product_image_effect_4281370');
        this.addToCard = page.locator('#ec_add_to_cart_5');
        this.checkOutCard = page.getByRole('link', { name: 'CHECKOUT NOW' });
    }

    async open(path = '') {
        await this.page.goto(path);
    }

    async numberOfProductsPerPage() {
        await this.productsPerPage.click();
    }

    async openImageLayoutJeans() {
        await this.imageLayoutJeans.click();
    }

    async btnAddToCard() {
        await this.addToCard.click();
    }

    async btnCheckOutCard() {
        await this.checkOutCard.click();
    }

}

