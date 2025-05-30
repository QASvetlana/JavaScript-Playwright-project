import { MainPage, ProductPage, FindBugsPage, CartPage } from './index';

export class App {
    constructor(page) {
        this.page = page;
        this.mainPage = new MainPage(page);
        this.productPage = new ProductPage(page);
        this.findBugsPage = new FindBugsPage(page);
        this.cartPage = new CartPage(page);
    }
};