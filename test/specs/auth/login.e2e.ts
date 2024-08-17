import { expect } from '@wdio/globals';
import LoginPage from '@pom/login.page';
import SecurePage from '@pom/secure.page';

describe('GX3-123: Auth', () => {
	it('GX3-123 TC1: Should login with user Z', async () => {
		await LoginPage.open();

		await LoginPage.login('tomsmith', 'SuperSecretPassword!');
		await expect(SecurePage.flashAlert).toBeExisting();
	});
	it('GX3-123 TC2: Should login with user A', async () => {
		await LoginPage.open();

		await LoginPage.login('tomsmith', 'SuperSecretPassword!');
		await expect(SecurePage.flashAlert).toBeExisting();
	});
	it('GX3-123 TC3: Should login with user C', async () => {
		await LoginPage.open();

		await LoginPage.login('tomsmith', 'SuperSecretPassword!');
		await expect(SecurePage.flashAlert).toBeExisting();
	});
});
