export class MainPage {
    constructor(page) {
        this.page = page;
        this.signupButton = page.getByRole('link', { name: 'Sign up'});
        this.loginButton = page.getByRole('link', { name: 'Login'});
    }
    
    async gotoRegister() {
        await this.signupButton.click();
    }
    async open(url) {
        await this.page.goto(url);
    }

    async gotoLogin() {
        await this.loginButton.click();
    }
}
