import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page';
import SecurePage from '@pom/secure.page';

describe('NewSubs', () => {
	it('C3834: NewSub as US Entity Corporation SPC', async () => {
		await LoginPage.open();

		await LoginPage.login('tomsmith', 'SuperSecretPassword!');
		await expect(SecurePage.flashAlert).toBeExisting();
	});
});
