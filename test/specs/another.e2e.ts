import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page';
import SecurePage from '@pom/secure.page';

describe('GX3-124: Another', () => {
	it('GX3-124 TC1: Other Test Case Example', async () => {
		await LoginPage.open();

		await LoginPage.login('tomsmith', 'SuperSecretPassword!');
		await expect(SecurePage.flashAlert).toBeExisting();
	});
});
