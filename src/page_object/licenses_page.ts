import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base_page';

export class LicensesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getPageTitleLocator() {
    return this.page.locator(
      '//*[@class="cart-body"]//*[contains(text(),"cPanel Licenses")]'
    );
  }

  getLicenseCardsLocator() {
    return this.page.locator(
      '//*[@id="products"]/div[@class = "row row-eq-height"]/*[@class = "col-md-6"]'
    );
  }

  getLicenseCardOrderButtonLocator(locator: Locator) {
    return locator.locator('//*[text()[contains(.,"Order Now")]]');
  }

  getLicenseCardHeaderLocator(locator: Locator) {
    return locator.locator('header');
  }

  getLicenseCardPriceLocator(locator: Locator) {
    return locator.locator('//*[@class="price"]');
  }

  verifyIsNotLoggedIn() {
    expect(this.getLoggedInLocator()).not.toBeVisible();
  }
}
