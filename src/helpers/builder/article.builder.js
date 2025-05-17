import { faker } from '@faker-js/faker';

export class ArticleBuilder {
	addTitle() {
		this.articleTitle = faker.lorem.lines(1);
		return this;
	}
	addDescription() {
		this.articleDescription = faker.lorem.lines(2);
		return this;
	}
	addArticle() {
		this.userArticle = faker.lorem.lines(4);
		return this;
	}

    addTag() {
		this.articleTag = faker.lorem.lines(1);
		return this;
	}

	generate() {
		return {
			title: this.articleTitle,
			description: this.articleDescription,
			article: this.userArticle,
            tag: this.articleTag,
		};
	}
}



