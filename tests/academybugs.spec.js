import { expect } from '@playwright/test';
import { test } from '../src/helpers/fixtures/academyBugsFixture';

test.describe('Поиск 5 багов на сайте академии багов', () => {
  test('Краш при смене количества отображаемых на странице товаров', async ({app}) => {
    await app.mainPage.numberOfProductsPerPage();
    await expect(app.findBugsPage.overlayWithFoundBug).toContainText('You found a crash bug, examine the page by clicking on any button for 5 seconds.');
  });

  test('Едет верстка фото товара', async ({app}) => {  
    await app.mainPage.openImageLayoutJeans();
    await expect(app.findBugsPage.modalWindowAboutBug).toBeVisible();
  });

  test('Краш при смене типа валюты', async ({app}) => {  
    await app.productPage.openImageLayoutShoes();
    await expect(app.productPage.currency).toBeVisible();
    await app.productPage.currencyChangeAttempt();
    await expect(app.findBugsPage.bugCounter).toBeVisible();
  });

  test('Кнопка "Домой" не возвращает пользователя на главную', async ({app}) => {  
    await app.mainPage.btnAddToCard();
    await app.mainPage.btnCheckOutCard();
    await app.cartPage.btnDeleteFromCard();
    await app.cartPage.returnHome();
    await expect(app.findBugsPage.modalWindowAboutBug).toContainText('What did you find out?');
  });

  test('При переходе на производителя 404', async ({app}) => { 
    await app.productPage.openImageLayoutShoes();
    await app.productPage.goToManufacterer();
    await expect(app.findBugsPage.modalWindowAboutBug).toContainText('What did you find out?');
  });
});