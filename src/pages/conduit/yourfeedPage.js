export class YourfeedPage {
    constructor(page) {
        this.page = page;
        this.newArticleButton = page.getByRole('link', { name: 'New Article'});
        this.profileNameField = page.getByRole('navigation');
        this.articletitleField = page.getByPlaceholder('Article Title');
        this.articledescriptionField = page.getByPlaceholder('What\'s this article about?');
        this.articleField = page.getByPlaceholder('Write your article (in');
        this.tagField = page.getByPlaceholder('Enter tags');
        this.publishButton = page.getByRole('button', { name: 'Publish Article'});
        this.globalField = page.getByRole('button', { name: 'Global Feed' });
        this.navigationDropdown = page.locator(`//div[contains(@class,"dropdown-toggle")]`);
        this.userSetting = page.getByRole('link', { name: 'Settings'});

    }

    async gotoArticle() {
        await this.newArticleButton.click();
    }

    async creatArticle(articletitle, articledescription, article, tag) {
        await this.articletitleField.click();
        await this.articletitleField.fill(articletitle);
        await this.articledescriptionField.click();
        await this.articledescriptionField.fill(articledescription);
        await this.articleField.click();
        await this.articleField.fill(article);
        await this.tagField.click();
        await this.tagField.fill(tag);
    }

    async publishArticle() {
        await this.publishButton.click();
    }

    async gotoGlobalField() {
        await this.globalField.click();
    }

    async gotoNavigationDropdown() {
        await this.navigationDropdown.click();
    }

    async chooseUserSetting() {
        await this.userSetting.click();
    }


}