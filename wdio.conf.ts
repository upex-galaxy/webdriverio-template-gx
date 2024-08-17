import type { Options } from '@wdio/types';
import type { RemoteCapabilities } from '@wdio/types/build/Capabilities';
import type { ReporterEntry } from '@wdio/types/build/Reporters';
import { addAttachment } from '@wdio/allure-reporter';
import { TEST_PLAN } from './test/TestPlan';
import { register } from 'tsconfig-paths';
import tsConfig from './tsconfig.json';
import path from 'node:path';
import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

register({
	baseUrl: tsConfig.compilerOptions.baseUrl,
	paths: tsConfig.compilerOptions.paths
});

//* ---- ENVIRONMENT CONFIG ---- *:
type TestEnvType = 'dev' | 'sandbox' | 'QA' | 'staging' | 'uat' | 'prod' | undefined;
export const TEST_ENV: TestEnvType = (process.env.TEST_ENV as TestEnvType) ?? 'QA'; // set QA as default just in case the env variable is not set
const ENVIRONMENTS = {
	dev: 'https://the-internet.herokuapp.com/',
	sandbox: 'https://the-internet.herokuapp.com/',
	QA: 'https://the-internet.herokuapp.com/',
	staging: 'https://the-internet.herokuapp.com/',
	uat: 'https://the-internet.herokuapp.com/',
	prod: 'https://the-internet.herokuapp.com/'
};
const ENV_BASE_URL = ENVIRONMENTS[TEST_ENV];

//* ---- Feature Flags ---- *:
const onCI = process.env.CI ? true : false; // On CI, we always want it to be TRUE
const isHEADLESS = onCI ? true : process.env.HEADLESS === 'true' ? true : false; // On CI, we always want to run headless
const isDEBUG = onCI ? false : process.env.DEBUG === 'true' ? true : false; // On CI, we always want it to be FALSE
const localTESTRAIL = process.env.USE_TESTRAIL === 'true' ? true : false;
const withTESTRAIL = onCI ? true : localTESTRAIL;

//* ---- Timing ---- *:
const DEFAULT_TimeoutInterval = 4 * 60 * 1000; // 4min
const DEBUG_TimeoutInterval = 24 * 60 * 60 * 1000; // 24 hours

//* ---- Directories ---- *:
export const screenshotPath = path.resolve(__dirname, 'test/screenshots'); // Screenshot directory is used to store screenshots during Tests (ignored by git)
export const downloadPath = path.resolve(__dirname, 'test/downloads'); // Download directory is used to store downloaded files during Tests (ignored by git)
export const dataPath = path.resolve(__dirname, 'test/data'); // Data directory (Permanent) is used to store test data files

//* ---- Capabilities ---- *:
const chromeArgs = [
	'--no-sandbox',
	'--disable-gpu', //? needed to enable google-chrome-headless on windows platform
	'--enable-chrome-browser-cloud-management', //? to enable chrome browser cloud management (CBCM) and prevent warning message
	'--disable-dev-shm-usage', //? The /dev/shm partition is too small in certain VM environments, causing Chrome to fail or crash. Use this flag to work-around this issue (a temporary directory will always be used to create anonymous shared memory files).
	'--disable-infobars', //? Disables the "Chrome is being controlled by automated test software" infobar
	'--window-size=1920,1080'
];
if (isHEADLESS) chromeArgs.push('--headless', '--start-maximized');

const DEFAULT_Capabilities: RemoteCapabilities = [
	{
		browserName: 'chrome',
		'goog:chromeOptions': {
			detach: !onCI, //? on CI, Chrome will be closed when the session is closed, on local, Chrome will stay open
			args: chromeArgs,
			prefs: { 'download.default_directory': downloadPath }
		}
	}
];
//* ---- Test Runs Strategy ---- *:
type TestRunStrategyType = 'Smoke' | 'Regression' | 'Sanity' | 'Suite' | undefined;
const TESTRAIL_RUN_STRATEGY: TestRunStrategyType = (process.env.TESTRAIL_RUN_STRATEGY as TestRunStrategyType) ?? 'Suite';
//? TESTRAIL_RUN_STRATEGY is used to create a custom name for the test run in TestRail. Depending on the CI file, the test run strategy can be set to Smoke, Regression, or Sanity

//* ---- REPORTERS CONFIG ---- *:
const reportsDir = path.resolve(__dirname, 'reports');
const allureReportRepoURL = 'https://upex-galaxy.github.io/webdriverio-template-gx';
const AllureConfig: ReporterEntry = [
	'allure',
	{
		outputDir: reportsDir + '/allure-results',
		reportedEnvironmentVars: {
			ENVIRONMENT: TEST_ENV,
			BROWSER: 'chrome', // default browser of this project
			'📊 SMOKE Allure Report': allureReportRepoURL + '/smoke',
			'📊 SANITY Allure Report': allureReportRepoURL + '/sanity',
			'📊 REGRESSION Allure Report': allureReportRepoURL
		},
		disableWebdriverStepsReporting: true,
		disableWebdriverScreenshotsReporting: true,
		disableMochaHooks: true,
		addConsoleLogs: true
	}
];
const VideoConfig: ReporterEntry = [
	'video',
	{
		//? outputDir by default is same as the wdio outputDir (reportsDir)
		saveAllVideos: true, // If true, also saves videos for successful test cases
		videoSlowdownMultiplier: 1, // Higher to get slower videos, lower for faster videos [Value 1-100]
		videoRenderTimeout: 3 * 60 * 1000, // Maximum time to wait for a video to finish rendering (in ms).
		videoFormat: 'mp4', // The video format to use //? This is a MUST for the video reporter to work!
		maxTestNameCharacters: 350 // Maximum characters to use for the test name in the file name
	}
];
const JUnitConfig: ReporterEntry = [
	'junit',
	{
		outputDir: reportsDir + '/junit-results',
		outputFileFormat: () => 'wdio-junit-test-reporter.xml',
		suiteNameFormat: /[^a-zA-Z0-9@:|#-]+/,
		classNameFormat: () => /[^a-zA-Z0-9@:|#-]+/
	}
];
// const TestRailConfig: ReporterEntry = [
// 	'testrail',
// 	{
// 		projectId: 2, // project id is here https://<project>.testrail.io/index.php?/projects/overview/<projectId>
// 		suiteId: 8, // suite id is here https://<project>.testrail.io/index.php?/suites/view/<suiteId>
// 		domain: '<project>.testrail.io',
// 		username: process.env.TESTRAIL_USERNAME,
// 		apiToken: process.env.TESTRAIL_APIKEY,
// 		runName: `Automated Test Run: ${TESTRAIL_RUN_STRATEGY}`, // custom name for the test run
// 		oneReport: true, // Create a single test run in TestRail.
// 		includeAll: false, // Include all tests in suite in test run.
// 	},
// ]; //? Learn about TestRail Importer: https://webdriver.io/docs/wdio-testrail-reporter/

const defaultReportConfig: ReporterEntry[] = ['spec', AllureConfig, VideoConfig, JUnitConfig];
// const testRailReportConfig: ReporterEntry[] = [
// 	'spec',
// 	AllureConfig,
// 	VideoConfig,
// ];
const ReportConfig = /*withTESTRAIL ? testRailReportConfig :*/ defaultReportConfig;
//? If the USE_TESTRAIL env variable is set to true, the TestRail reporter will be used. Otherwise, the default reporters will be used.

export const config: Options.Testrunner = {
	//
	//* ====================
	//* Runner Configuration
	//* ====================
	runner: 'local', // Keep it local for E2E testing.
	autoCompileOpts: {
		autoCompile: true,
		tsNodeOpts: {
			project: './tsconfig.json',
			transpileOnly: true
		}
	},
	headless: isHEADLESS, // default should be false
	//
	//* ==================
	//* Specify Test Files
	//* ==================
	specs: ['./test/specs/**/*.test.ts'],
	suites: TEST_PLAN, //? This is the Test Plan file, where every test filePath will be mapped to a unique named variable in order to be used as Identificator Name, so it can be organized into the Test Plan in different applicable Suites. Please refer to the TestPlan.ts file for more information.
	exclude: ['./test/specs/**/*.test.draft.ts'],
	//
	//* ============
	//* Capabilities
	//* ============
	maxInstances: onCI ? 5 : 1, // the more instances, the higher the load on the machine. keep it low for local testing
	capabilities: DEFAULT_Capabilities,
	execArgv: isDEBUG ? ['--inspect'] : [],
	//
	//* ===================
	//* Test Configurations
	//* ===================
	logLevel: 'debug', //? I suggest to keep it as debug to see all the logs in reports folder
	bail: 0,
	baseUrl: ENV_BASE_URL, // default is the QA environment //? available TEST_ENV options for Automation are: sandbox, QA, staging, uat, prod
	waitforTimeout: 10000, // Default timeout for all waitFor* commands. //? I think 10 seconds is enough for now.
	connectionRetryTimeout: 120000,
	connectionRetryCount: 3,
	services: ['devtools'],
	framework: 'mocha', // The following are supported: Mocha, Jasmine, and Cucumber
	specFileRetries: 0, //? Disabled because should not exist Flaky Tests in the first place
	// specFileRetriesDeferred: false, //? Useful Whether or not retried spec files should be retried immediately or deferred to the end of the queue
	//
	//* ===================
	//* Test Reporters
	//* ===================
	outputDir: reportsDir,
	reporters: ReportConfig,
	mochaOpts: {
		ui: 'bdd',
		timeout: isDEBUG ? DEBUG_TimeoutInterval : DEFAULT_TimeoutInterval,
		defaultTimeoutInterval: isDEBUG ? DEBUG_TimeoutInterval : DEFAULT_TimeoutInterval
	},
	//
	//* ===================
	//* Test Hooks
	//* ===================
	// WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
	// it and to build services around it. You can either apply a single function or an array of
	// methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
	// resolved to continue.
	/**
	 * Gets executed once before all workers get launched.
	 * @param {object} config wdio configuration object
	 * @param {Array.<Object>} capabilities list of capabilities details
	 */
	onPrepare: function (config, capabilities) {
		config;
		capabilities;
		console.log('🧪-------------- TEST SESSION STARTED --------------');
		console.log('🚀 -----> Test Environment: ', TEST_ENV);
		console.log('🚀 -----> Base URL: ', ENV_BASE_URL);
		console.log('🚀 -----> Test Run Strategy: ', TESTRAIL_RUN_STRATEGY);
		console.log('🚀 -----> TestRail: ', withTESTRAIL);
		console.log('🚀 -----> Headless: ', isHEADLESS);
		console.log('🚀 -----> Debugger: ', isDEBUG);
		// create test/screenshots dir if not exists:
		if (!fs.existsSync(screenshotPath)) fs.mkdirSync(screenshotPath);
		// create test/downloads dir if not exists:
		if (!fs.existsSync(downloadPath)) fs.mkdirSync(downloadPath);
	},
	/**
	 * Gets executed before a worker process is spawned and can be used to initialize specific service
	 * for that worker as well as modify runtime environments in an async fashion.
	 * @param  {string} cid      capability id (e.g 0-0)
	 * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
	 * @param  {object} specs    specs to be run in the worker process
	 * @param  {object} args     object that will be merged with the main configuration once worker is initialized
	 * @param  {object} execArgv list of string arguments passed to the worker process
	 */
	//? onWorkerStart: function (cid, caps, specs, args, execArgv) {
	// },
	/**
	 * Gets executed just after a worker process has exited.
	 * @param  {string} cid      capability id (e.g 0-0)
	 * @param  {number} exitCode 0 - success, 1 - fail
	 * @param  {object} specs    specs to be run in the worker process
	 * @param  {number} retries  number of retries used
	 */
	//? onWorkerEnd: function (cid, exitCode, specs, retries) {
	// },
	/**
	 * Gets executed just before initializing the webdriver session and test framework. It allows you
	 * to manipulate configurations depending on the capability or spec.
	 * @param {object} config wdio configuration object
	 * @param {Array.<Object>} capabilities list of capabilities details
	 * @param {Array.<String>} specs List of spec file paths that are to be run
	 * @param {string} cid worker id (e.g. 0-0)
	 */
	//? beforeSession: function (config, capabilities, specs, cid) {
	// },
	/**
	 * Gets executed before test execution begins. At this point you can access to all global
	 * variables like `browser`. It is the perfect place to define custom commands.
	 * @param {Array.<Object>} capabilities list of capabilities details
	 * @param {Array.<String>} specs        List of spec file paths that are to be run
	 * @param {object}         browser      instance of created browser/device session
	 */
	//? before: async function () {
	// },
	/**
	 * Runs before a WebdriverIO command gets executed.
	 * @param {string} commandName hook command name
	 * @param {Array} args arguments that command would receive
	 */
	//? beforeCommand: function (commandName, args) {
	// },
	/**
	 * Hook that gets executed before the suite starts
	 * @param {object} suite suite details
	 */
	//? beforeSuite: function (suite) {
	// },
	/**
	 * Function to be executed before a test (in Mocha/Jasmine) starts.
	 */
	//? beforeTest: function (test, context) {
	// },
	/**
	 * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
	 * beforeEach in Mocha)
	 */
	//? beforeHook: function (test, context, hookName) {
	// },
	/**
	 * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
	 * afterEach in Mocha)
	 */
	//? afterHook: function (test, context, { error, result, duration, passed, retries }, hookName) {
	// },
	/**
	 * Function to be executed after a test (in Mocha/Jasmine only)
	 * @param {object}  test             test object
	 * @param {object}  context          scope object the test was executed with
	 * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
	 * @param {*}       result.result    return object of test function
	 * @param {number}  result.duration  duration of test
	 * @param {boolean} result.passed    true if test has passed, otherwise false
	 * @param {object}  result.retries   information about spec related retries, e.g. `{ attempts: 0, limit: 0 }`
	 */
	afterTest: async function (test, context, { passed }) {
		test;
		context;
		// convert test.title into snake case string and remove special characters:
		const testName = test.title
			.replace(/[^a-zA-Z0-9]/g, '_')
			.toLowerCase()
			.replace(/_+/g, '_');

		if (!passed) {
			const screenshotFile = screenshotPath + '/' + testName + '.png';
			await browser.saveScreenshot(screenshotFile);
			addAttachment('❌FAILURE EVIDENCE: ' + testName + ' (Screenshot)', fs.readFileSync(screenshotFile), 'image/png');
		}
	},
	/**
	 * Hook that gets executed after the suite has ended
	 * @param {object} suite suite details
	 */
	//? afterSuite: function (suite) {
	// },
	/**
	 * Runs after a WebdriverIO command gets executed
	 * @param {string} commandName hook command name
	 * @param {Array} args arguments that command would receive
	 * @param {number} result 0 - command success, 1 - command error
	 * @param {object} error error object if any
	 */
	//? afterCommand: function (commandName, args, result, error) {
	// },
	/**
	 * Gets executed after all tests are done. You still have access to all global variables from
	 * the test.
	 * @param {number} result 0 - test pass, 1 - test fail
	 * @param {Array.<Object>} capabilities list of capabilities details
	 * @param {Array.<String>} specs List of spec file paths that ran
	 */
	//? after: function (result, capabilities, specs) {
	// },
	/**
	 * Gets executed right after terminating the webdriver session.
	 * @param {object} config wdio configuration object
	 * @param {Array.<Object>} capabilities list of capabilities details
	 * @param {Array.<String>} specs List of spec file paths that ran
	 */
	//? afterSession: function (config, capabilities, specs) {
	// },
	/**
	 * Gets executed after all workers got shut down and the process is about to exit. An error
	 * thrown in the onComplete hook will result in the test run failing.
	 * @param {object} exitCode 0 - success, 1 - fail
	 * @param {object} config wdio configuration object
	 * @param {Array.<Object>} capabilities list of capabilities details
	 * @param {<Object>} results object containing test results
	 */
	onComplete: function (exitCode, config, capabilities, results) {
		exitCode;
		config;
		capabilities;
		console.log('🧪------- Test Session Ended -------');
		console.log('🧪 TEST RESULTS:', results);
	}
	/**
	 * Gets executed when a refresh happens.
	 * @param {string} oldSessionId session ID of the old session
	 * @param {string} newSessionId session ID of the new session
	 */
	//? onReload: function(oldSessionId, newSessionId) {
	// }
	/**
	 * Hook that gets executed before a WebdriverIO assertion happens.
	 * @param {object} params information about the assertion to be executed
	 */
	//? beforeAssertion: function(params) {
	// }
	/**
	 * Hook that gets executed after a WebdriverIO assertion happened.
	 * @param {object} params information about the assertion that was executed, including its results
	 */
	//? afterAssertion: function(params) {
	// }
};
