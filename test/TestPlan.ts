//? This is the Test Plan file, where every test filePath will be mapped to a unique named variable in order to be used as Identificator Name, so it can be organized into the Test Plan below in different applicable Suites.
//*---- Mapped Test Files (Test Suites) ----:
//? by every test file path:
const example = './test/specs/another.e2e.ts';
//? by every test component path:
const authTests = './test/specs/auth/*.e2e.ts'; //? Also you can group the test files by the SUT components, so you can use it as a "Suite" for each component (group of test files), doing so you can organize the test plan by the SUT components.

//*---- TEST PLAN Strategies ----:
export const TEST_PLAN = {
	//? Every property of this Object represents a Test Run Strategy (smoke, sanity, regression, etc), which each one has an array of Suites (the Mapped Test Files) that are organized according to the strategy. This array represents the list of tests to be executed when the Test Run Strategy is called from the wdio.config.ts file to be used the entire Suite to execute.
	//*---- by Test Run Strategy ----:
	smoke: [authTests], //? Smoke Suites, Useful for CI/CD Pipelines after a new Dev deployment
	regression: [example, authTests], //? Regression Suites, Useful for CI/CD Pipelines after the smoke test
	//? Sanity Suites -- this strategy is about grouping the test Files by the SUT components
	sanityLogin: [authTests],
	sanityExample: [example],

	//*---- by Test Type Strategy ----:
	integration: [], // api testing (backend, using axios)
	e2e: [], // end-to-end UI testing (frontend)
	visual: [], // visual testing (UI, using plugins)
	performance: [] // performance testing (webdriverio is not the best tool for this)
};
