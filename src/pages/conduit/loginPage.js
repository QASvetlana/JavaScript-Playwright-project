export class LoginPage {
    constructor(page) {
        this.page = page;
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.loginEmailField = page.getByPlaceholder('Email');
        this.loginPasswordField = page.getByPlaceholder('Password');
    }
    
    async login(email, newpass) {
        await this.loginEmailField.click();
        await this.loginEmailField.fill(email);
        await this.loginPasswordField.click();
        await this.loginPasswordField.fill(newpass);
        await this.loginButton.click();
    }

}