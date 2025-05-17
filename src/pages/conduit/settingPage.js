export class SettingPage {
    constructor(page) {
        this.page = page;
        this.newPasswordField = page.getByPlaceholder('Password');
        this.updateSettingBotton = page.getByRole('button', { name: 'Update Settings' });
        this.navigationDrop = page.locator(`//div[contains(@class,"dropdown-toggle")]`);
        this.profileDrop = page.locator('a.dropdown-item:has-text("Profile")');
        this.settingDrop = page.locator('a.dropdown-item:has-text("Settings")');
        this.logoutBotton = page.getByRole('link', { name: 'Logout' });
    }

    async changePassword(newpass) {
        await this.newPasswordField.click();
        await this.newPasswordField.fill(newpass);
    }

    async updateUserSetting() {
        await this.updateSettingBotton.click();
    }

    async gotoNavigationDrop() {
        await this.navigationDrop.click();
    }
 
    async logout() {
        await this.logoutBotton.click();
    }

   

}
