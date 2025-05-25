import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MainPage, RegisterPage, YourfeedPage, ArticlePage, GlobalfeedPage} from '../src/pages/conduit/index';
import { ArticleBuilder, UserBuilder } from '../src/helpers/builder/index';

const URL_UI = 'https://realworld.qa.guru/';

test.describe('Авторизация новым пользователем', () => {
   test.beforeEach(async ({ page }) => {
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);
    const yourfeedPage = new YourfeedPage(page);
    const userBuilder = new UserBuilder()
			.addEmail()
			.addUsername()
			.addPassword(11)
			.generate();

      await mainPage.open(URL_UI);
      await mainPage.gotoRegister();
      await registerPage.register(
        userBuilder.username,
        userBuilder.email,
        userBuilder.password,
      );
 
});


 test('Пользователь может опубликовать статью', async ({ 
  page,
 }) => {
    const yourfeedPage = new YourfeedPage(page);
    const articlePage = new ArticlePage(page);
    const articleBuilder = new ArticleBuilder()
    .addTitle()
    .addDescription()
    .addArticle()
    .addTag()
    .generate();

    await yourfeedPage.gotoArticle();
    await yourfeedPage.creatArticle(articleBuilder.title, articleBuilder.description, articleBuilder.article, articleBuilder.tag);
    await yourfeedPage.publishArticle();
    await expect(articlePage.banner).toContainText(articleBuilder.title);

});

 test('Пользователь может оставить комментарий к статье', async ({ 
  page,
 }) => {
    const yourfeedPage = new YourfeedPage(page);
    const articlePage = new ArticlePage(page);
    const globalfeedPage = new GlobalfeedPage(page);
    const articleBuilder = new ArticleBuilder()
    .addTitle()
    .addDescription()
    .addArticle()
    .addTag()
    .generate();

    const newcomment = {
      commment: faker.lorem.lines(1),
    };

    await yourfeedPage.gotoArticle();
    await yourfeedPage.creatArticle(articleBuilder.title, articleBuilder.description, articleBuilder.article, articleBuilder.tag);
    await yourfeedPage.publishArticle();
    await articlePage.creatComment(newcomment.commment);
    await articlePage.publishComment();
    await expect(articlePage.commentPublished).toContainText(newcomment.commment);

});


/* test('Пользователь может поставить статье лайк', async ({ 
  page,
 }) => {
    const yourfeedPage = new YourfeedPage(page);
    const articlePage = new ArticlePage(page);
    const globalfeedPage = new GlobalfeedPage(page);
    const articleBuilder = new ArticleBuilder()
    .addTitle()
    .addDescription()
    .addArticle()
    .addTag()
    .generate();

    const newcomment = {
      commment: faker.lorem.lines(1),
    };

    const likenumber = {
      like: "1",
    };

    await yourfeedPage.gotoArticle();
    await yourfeedPage.creatArticle(articleBuilder.title, articleBuilder.description, articleBuilder.article, articleBuilder.tag);
    await yourfeedPage.publishArticle();
    await articlePage.creatComment(newcomment.commment);
    await articlePage.publishComment();
    await articlePage.clickToLogo();
    await yourfeedPage.gotoGlobalField();
    await globalfeedPage.clicktoheartButton();
    await expect(globalfeedPage.heartCounter).toContainText(likenumber.like);
});*/
});
