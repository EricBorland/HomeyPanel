import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): void {
    return browser.get(browser.baseUrl) as Promise<string>;
  }

  getTitleText(): void {
    return element(by.css('app-root .content span')).getText() as Promise<string>;
  }
}
