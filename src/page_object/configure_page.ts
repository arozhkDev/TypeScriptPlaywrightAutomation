import { Locator, Page } from '@playwright/test';
import { BasePage } from './base_page';

export class ConfigurePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getPageTitleLocator() {
    return this.page.locator(
      '//*[@class="header-lined"]//*[contains(text(),"Configure")]'
    );
  }

  getIpAddressLocator() {
    return this.page.locator('//*[@class="form-group"]/*[@type="text"]');
  }

  getAddonsLocator() {
    return this.page.locator(
      '//*[@id="productAddonsContainer"]/*[@class="row addon-products"]/*'
    );
  }

  getAddonLabelLocator(locator: Locator) {
    return locator.locator('label');
  }

  getAddonPriceLocator(locator: Locator) {
    return locator.locator('//*[@class="panel-price"]');
  }

  getAddonSummaryLocator(priceSubstring: string) {
    return this.page.locator(
      `//*[@class="order-summary"]//*[contains(text(),"${priceSubstring}")]`
    );
  }

  getContinueButtonLocator() {
    return this.page.locator('//*[@id="orderSummary"]//*[@type="submit"]');
  }

  async fillInIpAddressField(ipAddress: string) {
    await this.getIpAddressLocator().fill(ipAddress, { timeout: 20000 });
  }

  async blurIpAddressField() {
    await this.getIpAddressLocator().blur();
  }
}
