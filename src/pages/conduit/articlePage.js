export class ArticlePage {
    constructor(page) {
        this.page = page;
        this.banner = page.getByRole('heading');
        this.commentForm = page.getByPlaceholder('Write a comment...');
        this.publishCommentButton = page.getByRole('button', { name: 'Post Comment' });
        this.conduitLogo = page.getByRole('navigation').getByRole('link', { name: 'conduit' });
        this.commentPublished = page.locator(`(//div[contains(@class,"card-block")])[2]`);
}

async creatComment(comment) {
    await this.commentForm.click();
    await this.commentForm.fill(comment);
}

async publishComment() {
    await this.publishCommentButton.click();
}

async clickToLogo() {
    await this.conduitLogo.click();
}
}

