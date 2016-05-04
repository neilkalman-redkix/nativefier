var fs = require('fs-extra');
var exec = require('sync-exec');
var colors = require('colors');
var mkdirp = require('mkdirp');


var buildProduction = 'nativefier --name "Redkix" "https://beta.redkix.com/" --icon "assets/Production.ico" --counter --maximize --arch=ia32';
var buildStaging = 'nativefier --name "Redkix Staging" "https://staging.redkix.com/" --icon "assets/Staging.ico" --counter --maximize --arch=ia32';
var buildIntegration = 'nativefier --name "Redkix Integration" "http://int.redkix.com/" --icon "assets/Integration.ico" --counter --maximize --arch=ia32';
var buildNightly = 'nativefier --name "Redkix Nightly" "http://nightly.redkix.com/" --icon "assets/Dev.ico" --counter --maximize --arch=ia32';
var buildLocalhost = 'nativefier --name "Redkix localhost" "http://0.0.0.0:9000/" --icon "assets/Dev.ico" --counter --maximize --arch=ia32';

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

fs.copySync('./assets/Production.ico', './Redkix-win32-ia32/logo.ico');
fs.copySync('./assets/Staging.ico', './Redkix Staging-win32-ia32/logo.ico');
fs.copySync('./assets/Integration.ico', './Redkix Integration-win32-ia32/logo.ico');
fs.copySync('./assets/Dev.ico', './Redkix Nightly-win32-ia32/logo.ico');
fs.copySync('./assets/Dev.ico', './Redkix localhost-win32-ia32/logo.ico');

console.log('BUILD PHASE DONE'.black.bgCyan);

console.log('BUILD INSTALLERS PHASE STARTED'.black.bgMagenta);

console.log('Copying installers to folders...');

var basicInstall = fs.readFileSync('createInstaller.nsi', 'utf8');

// Production
var production = basicInstall;
// Staging
var staging = basicInstall.replace('!define APPNAME "Redkix"', '!define APPNAME "Redkix Staging"');
// Integration
var integration = basicInstall.replace('!define APPNAME "Redkix"', '!define APPNAME "Redkix Integration"');
// Nightly
var nightly = basicInstall.replace('!define APPNAME "Redkix"', '!define APPNAME "Redkix Nightly"');
// Staging
var localhost = basicInstall.replace('!define APPNAME "Redkix"', '!define APPNAME "Redkix localhost"');

fs.writeFileSync('./Redkix-win32-ia32/createInstaller.nsi', production, 'utf8');

fs.writeFileSync('./Redkix Staging-win32-ia32/createInstaller.nsi', staging, 'utf8');

fs.writeFileSync('./Redkix Integration-win32-ia32/createInstaller.nsi', integration, 'utf8');

fs.writeFileSync('./Redkix Nightly-win32-ia32/createInstaller.nsi', nightly, 'utf8');

fs.writeFileSync('./Redkix localhost-win32-ia32/createInstaller.nsi', localhost, 'utf8');

console.log('DONE'.green);

console.log('Creating Installers...');

console.log('Building Production desktop Installer...');
exec('"C:\\Program Files (x86)\\NSIS\\makensis.exe" "Redkix-win32-ia32\\createInstaller.nsi"');
console.log('DONE'.green);

console.log('Building Staging desktop Installer...');
exec('"C:\\Program Files (x86)\\NSIS\\makensis.exe" "Redkix Staging-win32-ia32\\createInstaller.nsi"');
console.log('DONE'.green);

console.log('Building Integration desktop Installer...');
exec('"C:\\Program Files (x86)\\NSIS\\makensis.exe" "Redkix Integration-win32-ia32\\createInstaller.nsi"');
console.log('DONE'.green);

console.log('Building Nightly desktop Installer...');
exec('"C:\\Program Files (x86)\\NSIS\\makensis.exe" "Redkix Nightly-win32-ia32\\createInstaller.nsi"');
console.log('DONE'.green);

console.log('Building localhost desktop Installer...');
exec('"C:\\Program Files (x86)\\NSIS\\makensis.exe" "Redkix localhost-win32-ia32\\createInstaller.nsi"');
console.log('DONE'.green);

console.log('BUILD INSTALLERS PHASE DONE'.black.bgMagenta);

console.log('BUILD FINISHED'.greenBg);

mkdirp('./WIN_x32', function(err) { 

    fs.copySync( './Redkix-win32-ia32/Redkix Installer.exe', './WIN_x32/Redkix Installer.exe');
	fs.copySync('./Redkix Staging-win32-ia32/Redkix Staging Installer.exe', './WIN_x32/Redkix Staging Installer.exe');
	fs.copySync('./Redkix Integration-win32-ia32/Redkix Integration Installer.exe', './WIN_x32/Redkix Integration Installer.exe');
	fs.copySync('./Redkix Nightly-win32-ia32/Redkix Nightly Installer.exe', './WIN_x32/Redkix Nightly Installer.exe');
	fs.copySync('./Redkix localhost-win32-ia32/Redkix localhost Installer.exe', './WIN_x32/Redkix localhost Installer.exe');

});

return 0;