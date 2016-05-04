var fs = require('fs-extra');
var exec = require('sync-exec');
var colors = require('colors');
var mkdirp = require('mkdirp');

var buildProduction = 'nativefier --name "Redkix" "https://beta.redkix.com/" --icon "assets/Production.icns" --counter --maximize';
var buildStaging = 'nativefier --name "Redkix Staging" "https://staging.redkix.com/" --icon "assets/Staging.icns" --counter --maximize';
var buildIntegration = 'nativefier --name "Redkix Integration" "http://int.redkix.com/" --icon "assets/Integration.icns" --counter --maximize';
var buildNightly = 'nativefier --name "Redkix Nightly" "http://nightly.redkix.com/" --icon "assets/Dev.icns" --counter --maximize';
var buildLocalhost = 'nativefier --name "Redkix localhost" "http://0.0.0.0:9000/" --icon "assets/Dev.icns" --counter --maximize';


console.log('BUILD LATEST NATIVEFIER AND CREATE GLOBAL VARIABLE'.black.bgRed);
exec('npm run dev-up');
exec('npm link');
console.log('DONE.'.black.bgRed);

console.log('BUILD PHASE STARTED'.black.bgCyan);

console.log('Building Production desktop wrapper...');
exec(buildProduction);
console.log('DONE'.green);

console.log('Building Staging desktop wrapper...');
exec(buildStaging);
console.log('DONE'.green);

console.log('Building Integration desktop wrapper...');
exec(buildIntegration);
console.log('DONE'.green);

console.log('Building Nightly desktop wrapper...');
exec(buildNightly);
console.log('DONE'.green);

console.log('Building localhost desktop wrapper...');
exec(buildLocalhost);
console.log('DONE'.green);

console.log('BUILD PHASE DONE'.black.bgCyan);

console.log('BUILD INSTALLERS PHASE STARTED'.black.bgMagenta);

/* MAKE INSTALLERS FOR ALL VERSIONS */
console.log('Building Production desktop Installer...');
exec('dropdmg --config-name=Redkix "Redkix-darwin-x64/Redkix.app"');
console.log('DONE'.green);
console.log('Building Staging desktop Installer...');
exec('dropdmg --config-name=Redkix "Redkix Staging-darwin-x64/Redkix Staging.app"');
console.log('DONE'.green);
console.log('Building Integration desktop Installer...');
exec('dropdmg --config-name=Redkix "Redkix Integration-darwin-x64/Redkix Integration.app"');
console.log('DONE'.green);
console.log('Building Nightly desktop Installer...');
exec('dropdmg --config-name=Redkix "Redkix Nightly-darwin-x64/Redkix Nightly.app"');
console.log('DONE'.green);
console.log('Building localhost desktop Installer...');
exec('dropdmg --config-name=Redkix "Redkix localhost-darwin-x64/Redkix localhost.app"');
console.log('DONE'.green);