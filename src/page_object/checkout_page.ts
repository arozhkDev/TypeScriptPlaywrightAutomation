import { Locator, Page } from '@playwright/test';
import { BasePage } from './base_page';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  getTableLocator() {
    return this.page.locator('//*[@class="table"]/tbody//tr');
  }

  getTitleLocator(locator: Locator, title: string) {
    return locator.locator(`//td[1][text()[contains(.,"${title}")]]`);
  }

  getIpAddressLocator(locator: Locator, ipAddress: string) {
    return locator.locator(`//td[3][text()[contains(.,"${ipAddress}")]]`);
  }

  getPriceLocator(locator: Locator, price: string) {
    return locator.locator(`//td[4][text()[contains(.,"${price}")]]`);
  }

  getProratedPriceLocator(locator: Locator, proratedPrice: string) {
    return locator.locator(`//td[5][text()[contains(.,"${proratedPrice}")]]`);
  }

  async findProductRowByTitle(rows: Locator[], title: string) {
    for (const row of rows) {
      if (!(await this.getTitleLocator(row, title).isVisible())) {
        continue;
      }
      return row;
    }
    return null;
  }

  getPersonalInformationTitleLocator() {
    return this.page.locator(
      '//*[@id="containerNewUserSignup"]//span[text()[contains(.,"Personal Information")]]'
    );
  }

  getFirstNameFieldLocator() {
    return this.page.locator('//*[@id="inputFirstName"]');
  }

  getBillingAddressTitleLocator() {
    return this.page.locator(
      '//*[@id="containerNewUserSignup"]//span[text()[contains(.,"Billing Address")]]'
    );
  }

  getCompanyNameFieldLocator() {
    return this.page.locator('//*[@id="inputCompanyName"]');
  }

  getAccountSecurityTitleLocator() {
    return this.page.locator(
      '//*[@id="containerNewUserSecurity"]//span[text()[contains(.,"Account Security")]]'
    );
  }

  getPasswordFieldLocator() {
    return this.page.locator('//*[@name="password"]');
  }

  getTermsConditionsTitleLocator() {
    return this.page.locator(
      '//*[@class="sub-heading"]//span[text()[contains(.,"Terms & Conditions")]]'
    );
  }

  getEndUserLicenseButtonLocator() {
    return this.page.locator(
      '//*[@id="frmCheckout"]//*[text()[contains(.,"End User License Agreement")]]'
    );
  }

  getPaymentDetailsTitleLocator() {
    return this.page.locator(
      '//*[@class="sub-heading"]//span[text()[contains(.,"Payment Details")]]'
    );
  }

  getCardNameFieldLocator() {
    return this.page.locator('//*[@id="inputCardNumber"]');
  }

  getCompleteOrderButtonLocator() {
    return this.page.locator('//*[@id="btnCompleteOrder"]');
  }
}
