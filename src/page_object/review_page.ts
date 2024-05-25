import { Locator, Page } from '@playwright/test';
import { BasePage } from './base_page';

export class ReviewPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getPageTitleLocator() {
    return this.page.locator(
      '//*[@class="header-lined"]//*[contains(text(),"Review & Checkout")]'
    );
  }

  getProductLocator() {
    return this.page.locator('//*[@class="view-cart-items"]//*[@class="item"]');
  }

  getProductMonthlyPriceLocator(locator: Locator, price: string) {
    return locator.locator(
      `//*[contains(@class, "item-price")]/*[@class="cycle"][text()[contains(.,"${price}")]]`
    );
  }

  getProductProratedPriceLocator(locator: Locator, price: string) {
    return locator.locator(
      `//*[contains(@class, "item-price")]/*[not(contains(@class, "cycle"))][text()[contains(.,"${price}")]]`
    );
  }

  getProductTitleLocator(locator: Locator, title: string) {
    return locator.locator(
      `//*[contains(@class, "item-title")][text()[contains(.,"${title}")]]`
    );
  }

  getTotalDueTodayLocator() {
    return this.page.locator('//*[@id="totalDueToday"]');
  }

  getCheckoutButtonLocator() {
    return this.page.locator('//*[@id="checkout"]');
  }

  async findProductCardByTitle(cards: Locator[], title: string) {
    for (const card of cards) {
      if (!(await this.getProductTitleLocator(card, title).isVisible())) {
        continue;
      }
      return card;
    }
    return null;
  }
}
