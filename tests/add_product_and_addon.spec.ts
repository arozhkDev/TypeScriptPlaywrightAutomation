import { test, expect, Locator } from '@playwright/test';
import { LicensesPage } from '../src/page_object/licenses_page';
import { getRandomElement } from '../src/utils/random';
import { ConfigurePage } from '../src/page_object/configure_page';
import { licensesUrl } from '../src/configs/urls';
import { extractNumber, formatNumber } from '../src/utils/extract_number';
import { getDueToday } from '../src/utils/due_today';
import { ReviewPage } from '../src/page_object/review_page';
import { CheckoutPage } from '../src/page_object/checkout_page';
import { ipAddress } from '../src/test_parameters/add_product_and_addon';
import assert from 'assert';

test('has title', async ({ page }) => {
  let licenseCard: Locator | null = null;
  let licenseTitle: string | null = null;
  let licensePrice: number | null = null;
  let licenseProratedPrice: number | null = null;
  let totalLicensePrice: number = 0;

  const addonCards: Locator[] = [];
  const addonTitles: string[] = [];
  const addonPrices: number[] = [];
  const addonProratedPrices: number[] = [];

  const licensesPage = new LicensesPage(page);
  const configurePage = new ConfigurePage(page);
  const reviewPage = new ReviewPage(page);
  const checkoutPage = new CheckoutPage(page);

  await test.step('Navigate to licenses page and verify log in', async () => {
    await page.goto(licensesUrl);
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');

    licensesPage.verifyIsNotLoggedIn();
  });

  await test.step('Select license card and its data', async () => {
    await licensesPage.getPageTitleLocator().first().focus();
    const licenseCards = await licensesPage.getLicenseCardsLocator().all();
    const licenseCard = getRandomElement(licenseCards);

    assert(licenseCard);
    licenseTitle = await licensesPage
      .getLicenseCardHeaderLocator(licenseCard)
      .innerText();

    const licensePriceLabel = await licensesPage
      .getLicenseCardPriceLocator(licenseCard)
      .innerText();

    licensePrice = extractNumber(licensePriceLabel);

    await licensesPage.getLicenseCardOrderButtonLocator(licenseCard).click();
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  });

  await test.step('Fill in ip address', async () => {
    await configurePage.fillInIpAddressField(ipAddress);
    await configurePage.blurIpAddressField();
  });

  await test.step('Select addon and get its data', async () => {
    await configurePage.getPageTitleLocator().first().focus();
    const addons = await configurePage.getAddonsLocator().all();
    const addon = getRandomElement(addons);

    if (!addon) {
      return;
    }

    addonTitles.push(
      (await configurePage.getAddonLabelLocator(addon).innerText()).slice(1)
    );

    const addonPriceLabel = await configurePage
      .getAddonPriceLocator(addon)
      .innerText();
    const addonPriceSubstring = addonPriceLabel
      .split(' ')
      .slice(0, 2)
      .join(' ');

    await addon.click();

    await expect(
      configurePage.getAddonSummaryLocator(addonPriceSubstring)
    ).toBeVisible();

    addonPrices.push(extractNumber(addonPriceLabel));
  });

  await test.step('Submit configuration', async () => {
    await configurePage.getContinueButtonLocator().click();
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  });

  await test.step('Verify the expected products and addons are presented in the products list', async () => {
    await reviewPage.getPageTitleLocator().first().focus();
    const productCards = await reviewPage.getProductLocator().all();

    expect(productCards.length).toEqual(1 + addonTitles.length);

    assert(licenseTitle);
    licenseCard = await reviewPage.findProductCardByTitle(
      productCards,
      licenseTitle
    );

    expect(licenseCard).toBeDefined();

    for (const addonTitle of addonTitles) {
      const addonCard = await reviewPage.findProductCardByTitle(
        productCards,
        addonTitle
      );
      expect(addonCard).toBeDefined();

      assert(addonCard);
      addonCards.push(addonCard);
    }
  });

  await test.step('Verify product prices are correct and prorated', async () => {
    assert(licensePrice);
    totalLicensePrice =
      addonPrices.reduce((acc, i) => acc + i, 0) + licensePrice;

    assert(licenseCard);
    await expect(
      reviewPage.getProductMonthlyPriceLocator(
        licenseCard,
        formatNumber(totalLicensePrice)
      )
    ).toBeVisible();

    for (let index = 0; index < addonCards.length; index++) {
      const addonCard = addonCards[index];
      const addonPrice = addonPrices[index];

      await expect(
        reviewPage.getProductMonthlyPriceLocator(
          addonCard,
          formatNumber(addonPrice)
        )
      ).toBeVisible();
    }

    licenseProratedPrice = getDueToday(licensePrice);
    await expect(
      reviewPage.getProductProratedPriceLocator(
        licenseCard,
        formatNumber(licenseProratedPrice)
      )
    ).toBeVisible();

    for (let index = 0; index < addonCards.length; index++) {
      const addonCard = addonCards[index];
      const addonPrice = addonPrices[index];

      const addonProratedPrice = getDueToday(addonPrice);
      await expect(
        reviewPage.getProductProratedPriceLocator(
          addonCard,
          formatNumber(addonProratedPrice)
        )
      ).toBeVisible();

      addonProratedPrices.push(addonProratedPrice);
    }
  });

  await test.step('Perform checkout', async () => {
    reviewPage.getCheckoutButtonLocator().click();
    await page.waitForLoadState('networkidle');
    await page.waitForLoadState('domcontentloaded');
  });

  await test.step('Verify checkout information', async () => {
    await checkoutPage.getTableLocator().first().focus();
    const orderSummary = await checkoutPage.getTableLocator().all();

    expect(orderSummary.length).toEqual(1 + addonTitles.length);

    assert(licenseTitle);
    licenseCard = await checkoutPage.findProductRowByTitle(
      orderSummary,
      licenseTitle
    );
    
    expect(licenseCard).toBeDefined();

    assert(licenseCard);
    expect(
      checkoutPage.getIpAddressLocator(licenseCard, ipAddress)
    ).toBeVisible();

    assert(totalLicensePrice);
    expect(
      checkoutPage.getPriceLocator(licenseCard, formatNumber(totalLicensePrice))
    ).toBeVisible();

    assert(licenseProratedPrice);
    expect(
      checkoutPage.getProratedPriceLocator(
        licenseCard,
        formatNumber(licenseProratedPrice)
      )
    ).toBeVisible();

    for (let index = 0; index < addonTitles.length; index++) {
      const addonTitle = addonTitles[index];

      const addonCard = await checkoutPage.findProductRowByTitle(
        orderSummary,
        addonTitle
      );

      expect(addonCard).toBeDefined();

      assert(addonCard);
      expect(
        checkoutPage.getIpAddressLocator(addonCard, ipAddress)
      ).toBeVisible();

      const addonPrice = addonPrices[index];
      expect(
        checkoutPage.getPriceLocator(addonCard, formatNumber(addonPrice))
      ).toBeVisible();

      const addonProratedPrice = addonProratedPrices[index];
      expect(
        checkoutPage.getProratedPriceLocator(
          addonCard,
          formatNumber(addonProratedPrice)
        )
      ).toBeVisible();
    }
  });

  await test.step('Verify Checkout page sections are visible', async () => {
    expect(checkoutPage.getPersonalInformationTitleLocator()).toBeVisible();
    expect(checkoutPage.getFirstNameFieldLocator()).toBeVisible();
    expect(checkoutPage.getBillingAddressTitleLocator()).toBeVisible();
    expect(checkoutPage.getCompanyNameFieldLocator()).toBeVisible();
    expect(checkoutPage.getAccountSecurityTitleLocator()).toBeVisible();
    expect(checkoutPage.getPasswordFieldLocator()).toBeVisible();
    expect(checkoutPage.getTermsConditionsTitleLocator()).toBeVisible();
    expect(checkoutPage.getEndUserLicenseButtonLocator()).toBeVisible();
    expect(checkoutPage.getPaymentDetailsTitleLocator()).toBeVisible();
    expect(checkoutPage.getCardNameFieldLocator()).toBeVisible();
  });

  await test.step('Verify "Complete Order" button is visible but disabled', async () => {
    expect(checkoutPage.getCompleteOrderButtonLocator()).toBeVisible();
    expect(checkoutPage.getCompleteOrderButtonLocator()).toBeDisabled();
  });
});
