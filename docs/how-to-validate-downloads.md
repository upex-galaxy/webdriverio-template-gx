# How to Validate DownloadFiles

In the Test Config File, use this setup:

```javascript
import path from 'node:path';
import url from 'node:url';
// this is how we set the downloaded file path when downloading:
const downloadPath = path.resolve(__dirname, 'downloads');
// add this to the chrome capabilities:
[
	{
		browserName: 'chrome',
		'goog:chromeOptions': {
			args: chromeArgs,
			prefs: { 'download.default_directory': downloadPath },
		},
	},
];
```

Then, in the test file, check the relative path in repo and validate file is downloaded.

```javascript
import fs from 'fs';
import { downloadPath } from '@wdioconf';
...// inside the test...
const givenFileName = "example.pdf"
const filePath = `${downloadPath}/${givenFileName}` // this is how we build the expected path for validation.
const downloadButton = await $("div.form-row button");
await downloadButton.click();

await driver.waitUntil(async () => {
	return fs.existsSync(filePath);
}, {timeout: 3000, timeoutMsg: "file not downloaded yet."});

const fileExists = fs.existsSync(filePath);
await expect(fileExists).toBeTruthy();
...
```
