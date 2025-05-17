import { test, expect } from '@playwright/test';
import { MainPage, ProductPage, CartPage, FindBugsPage } from '../src/pages/academybugs/index';

const URL_UI = 'https://academybugs.com/find-bugs/';

test.describe('Поиск 5 багов на сайте академии багов', () => {
  let mainPage;
  let productPage; 
  let cartPage;
  let findBugsPage;


  test.beforeEach(async ({ page }) => {
    mainPage = new MainPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    findBugsPage = new FindBugsPage(page);
    
    await mainPage.open(URL_UI); 
  });

  test('Краш при смене количества отображаемых на странице товаров', async () => {
    await mainPage.numberOfProductsPerPage();
    await expect(findBugsPage.overlayWithFoundBug).toContainText('You found a crash bug, examine the page by clicking on any button for 5 seconds.');
  });

  test('Едет верстка фото товара', async () => {
    await mainPage.openImageLayoutJeans();
    await expect(findBugsPage.modalWindowAboutBug).toBeVisible();
  });

  test('Краш при смене типа валюты', async () => {
    await productPage.openImageLayoutShoes();
    await expect(productPage.currency).toBeVisible();
    await productPage.currencyChangeAttempt();
    await expect(findBugsPage.bugCounter).toBeVisible();
  });

  test('Кнопка "Домой" не возвращает пользователя на главную', async () => {
    await mainPage.btnAddToCard();
    await mainPage.btnCheckOutCard();
    await cartPage.btnDeleteFromCard();
    await cartPage.returnHome();
    await expect(findBugsPage.modalWindowAboutBug).toContainText('What did you find out?');
  });

  test('При переходе на производителя 404', async () => {
    await productPage.openImageLayoutShoes();
    await productPage.goToManufacterer();
    await expect(findBugsPage.modalWindowAboutBug).toContainText('What did you find out?');
  });
});
