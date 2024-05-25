import { Page } from '@playwright/test';

export class BasePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getLoggedInLocator() {
    return this.page.locator(
      '//*[@class="input-group-text"][contains(text(), "Logged in as:")]'
    );
  }
}
