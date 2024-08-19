import { $ } from '@wdio/globals';
import Page from './page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
	/**
	 * define selectors using getter methods
	 */
	public get inputUsername() {
		return $('#username');
	}

	public get inputPassword() {
		return $('#password');
	}

	public get btnSubmit() {
		return $('button[type="submit"]');
	}

	async submitButton() {
		await this.btnSubmit.click();
	}

	async login(username: string, password: string) {
		await this.inputUsername.setValue(username);
		await this.inputPassword.setValue(password);
		await this.btnSubmit.click();
	}

	/**
	 * overwrite specific options to adapt it to page object
	 */
	open() {
		return super.open('login');
	}
}

export default new LoginPage();
