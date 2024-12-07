'use strict';

var fs = require('node:fs/promises');
var path = require('node:path');
var node_url = require('node:url');
var c = require('chalk');
var enquirer = require('enquirer');
var execa = require('execa');
var getPackageJson = require('package-json');
var meow = require('meow');
var ora = require('ora');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var fs__default = /*#__PURE__*/_interopDefault(fs);
var path__default = /*#__PURE__*/_interopDefault(path);
var c__default = /*#__PURE__*/_interopDefault(c);
var enquirer__default = /*#__PURE__*/_interopDefault(enquirer);
var execa__default = /*#__PURE__*/_interopDefault(execa);
var getPackageJson__default = /*#__PURE__*/_interopDefault(getPackageJson);
var meow__default = /*#__PURE__*/_interopDefault(meow);
var ora__default = /*#__PURE__*/_interopDefault(ora);

var thisPackage = {
	name: "create-keystone-app",
	version: "10.0.3",
	license: "MIT",
	type: "module",
	main: "dist/create-keystone-app.cjs.js",
	module: "dist/create-keystone-app.esm.js",
	repository: "https://github.com/keystonejs/keystone/tree/main/packages/create",
	bin: "./cli.js",
	exports: {
		".": {
			module: "./dist/create-keystone-app.esm.js",
			"default": "./dist/create-keystone-app.cjs.js"
		},
		"./package.json": "./package.json"
	},
	preconstruct: {
		entrypoints: [
			"index.ts"
		]
	},
	dependencies: {
		chalk: "^4.1.2",
		enquirer: "^2.4.1",
		execa: "^5.1.1",
		meow: "^9.0.0",
		ora: "^8.0.1",
		"package-json": "^10.0.0"
	},
	files: [
		"dist",
		"starter",
		"cli.js"
	]
};

async function checkVersion() {
  const {
    version: upstream
  } = await getPackageJson__default["default"]('create-keystone-app');
  if (upstream === thisPackage.version) return;
  console.error(`⚠️  You're running an old version of create-keystone-app, please update to ${upstream}`);
}
class UserError extends Error {}
const __dirname$1 = path__default["default"].dirname(node_url.fileURLToPath((typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT' && document.currentScript.src || new URL('dist\create-keystone-app.cjs.dev.js', document.baseURI).href))));
const starterDir = path__default["default"].normalize(`${__dirname$1}/../starter`);
const cli = meow__default["default"](`
Usage
  $ create-keystone-app [directory]
`);
async function normalizeArgs() {
  let directory = cli.input[0];
  if (!directory) {
    ({
      directory
    } = await enquirer__default["default"].prompt({
      type: 'input',
      name: 'directory',
      message: 'What directory should create-keystone-app generate your app into?',
      validate: x => !!x
    }));
    process.stdout.write('\n');
  }
  return {
    directory: path__default["default"].resolve(directory)
  };
}
(async (_process$env$npm_conf, _process$env$npm_conf2) => {
  process.stdout.write('\n');
  console.log(`✨ You're about to generate a project using ${c__default["default"].bold('Keystone 6')} packages.`);
  await checkVersion();
  const normalizedArgs = await normalizeArgs();
  const nextCwd = normalizedArgs.directory;
  await fs__default["default"].mkdir(nextCwd);
  await Promise.all(['_gitignore', 'schema.ts', 'package.json', 'tsconfig.json', 'keystone.ts', 'auth.ts', 'README.md'].map(filename => fs__default["default"].copyFile(path__default["default"].join(starterDir, filename), path__default["default"].join(normalizedArgs.directory, filename.replace(/^_/, '.')))));
  const [packageManager] = (_process$env$npm_conf = (_process$env$npm_conf2 = process.env.npm_config_user_agent) === null || _process$env$npm_conf2 === void 0 ? void 0 : _process$env$npm_conf2.split('/', 1)) !== null && _process$env$npm_conf !== void 0 ? _process$env$npm_conf : ['npm'];
  const spinner = ora__default["default"](`Installing dependencies with ${packageManager}. This may take a few minutes.`).start();
  try {
    await execa__default["default"](packageManager, ['install'], {
      cwd: nextCwd
    });
    spinner.succeed(`Installed dependencies with ${packageManager}.`);
  } catch (err) {
    spinner.fail(`Failed to install with ${packageManager}.`);
    throw err;
  }
  const relativeProjectDir = path__default["default"].relative(process.cwd(), normalizedArgs.directory);
  process.stdout.write('\n');
  console.log(`🎉  Keystone created a starter project in: ${c__default["default"].bold(relativeProjectDir)}

  ${c__default["default"].bold('To launch your app, run:')}

  - cd ${relativeProjectDir}
  - ${packageManager} run dev

  ${c__default["default"].bold('Next steps:')}

  - Read ${c__default["default"].bold(`${relativeProjectDir}${path__default["default"].sep}README.md`)} for additional getting started details.
  - Edit ${c__default["default"].bold(`${relativeProjectDir}${path__default["default"].sep}keystone.ts`)} to customize your app.
  - Star Keystone on GitHub (https://github.com/keystonejs/keystone)
`);
})().catch(err => {
  if (err instanceof UserError) {
    console.error(err.message);
  } else {
    console.error(err);
  }
  process.exit(1);
});
