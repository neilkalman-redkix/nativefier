var fs = require('fs-extra');
var exec = require('sync-exec');
var colors = require('colors');
var mkdirp = require('mkdirp');
var redkixNativefierInfo = require('./package.json');

var isWindows = /^win/.test(process.platform);

var versionArray = redkixNativefierInfo.version.split('.');
var MAJOR_VERSION = versionArray[0];
var MINOR_VERSION = versionArray[1];
var BUILD_VERSION = versionArray[2];
console.log(['VERSION ', redkixNativefierInfo.version].join('').bgMagenta.black);

if (isWindows) {
    console.log('Building for Windows x32'.bgCyan.black);

    var rcedit = require('rcedit');

    var buildProduction = 'nativefier --name "Redkix" "https://beta.redkix.com/" --icon "assets/Production.ico" --counter --maximize --arch=ia32';
    var buildStaging = 'nativefier --name "Redkix Staging" "https://staging.redkix.com/" --icon "assets/Staging.ico" --counter --maximize --arch=ia32';
    var buildIntegration = 'nativefier --name "Redkix Integration" "https://int.redkix.com/" --icon "assets/Integration.ico" --counter --maximize --arch=ia32';
    var buildNightly = 'nativefier --name "Redkix Nightly" "https://nightly.redkix.com/" --icon "assets/Dev.ico" --counter --maximize --arch=ia32';
    var buildLocalhost = 'nativefier --name "Redkix localhost" "http://0.0.0.0:9000/" --icon "assets/Dev.ico" --counter --maximize --arch=ia32';
    var buildGmail = 'nativefier --name "Redkix Gmail" "http://gmail.redkix.com/" --icon "assets/redkixGmail.ico" --counter --maximize --arch=ia32';

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

    console.log('Building gmail desktop wrapper...');
    exec(buildGmail);
    console.log('DONE'.green);

    fs.copySync('./assets/Production.ico', './Redkix-win32-ia32/logo.ico');
    fs.copySync('./assets/Staging.ico', './Redkix Staging-win32-ia32/logo.ico');
    fs.copySync('./assets/Integration.ico', './Redkix Integration-win32-ia32/logo.ico');
    fs.copySync('./assets/Dev.ico', './Redkix Nightly-win32-ia32/logo.ico');
    fs.copySync('./assets/Dev.ico', './Redkix localhost-win32-ia32/logo.ico');
    fs.copySync('./assets/redkixGmail.ico', './Redkix Gmail-win32-ia32/logo.ico');

    console.log('BUILD PHASE DONE'.black.bgCyan);

    console.log('BUILD INSTALLERS PHASE STARTED'.black.bgMagenta);

    console.log('Copying installers to folders...');

    var basicInstall = fs.readFileSync('createInstaller.nsi', 'utf8');

		// Production
    var production = basicInstall;
		// Staging
    var staging = basicInstall.replace('!define APPNAME "Redkix"', '!define APPNAME "Redkix Staging"')
			.replace('!define VERSIONMAJOR 0', '!define VERSIONMAJOR ' + MAJOR_VERSION)
			.replace('!define VERSIONMINOR 0', '!define VERSIONMINOR ' + MINOR_VERSION)
			.replace('!define VERSIONBUILD 0', '!define VERSIONBUILD ' + BUILD_VERSION);
			// Integration
    var integration = basicInstall.replace('!define APPNAME "Redkix"', '!define APPNAME "Redkix Integration"')
			.replace('!define VERSIONMAJOR 0', '!define VERSIONMAJOR ' + MAJOR_VERSION)
			.replace('!define VERSIONMINOR 0', '!define VERSIONMINOR ' + MINOR_VERSION)
			.replace('!define VERSIONBUILD 0', '!define VERSIONBUILD ' + BUILD_VERSION);
			// Nightly
    var nightly = basicInstall.replace('!define APPNAME "Redkix"', '!define APPNAME "Redkix Nightly"')
			.replace('!define VERSIONMAJOR 0', '!define VERSIONMAJOR ' + MAJOR_VERSION)
			.replace('!define VERSIONMINOR 0', '!define VERSIONMINOR ' + MINOR_VERSION)
			.replace('!define VERSIONBUILD 0', '!define VERSIONBUILD ' + BUILD_VERSION);
			// Staging
    var localhost = basicInstall.replace('!define APPNAME "Redkix"', '!define APPNAME "Redkix localhost"')
			.replace('!define VERSIONMAJOR 0', '!define VERSIONMAJOR ' + MAJOR_VERSION)
			.replace('!define VERSIONMINOR 0', '!define VERSIONMINOR ' + MINOR_VERSION)
			.replace('!define VERSIONBUILD 0', '!define VERSIONBUILD ' + BUILD_VERSION);
			// Gmail
    var gmail = basicInstall.replace('!define APPNAME "Redkix"', '!define APPNAME "Redkix Gmail"')
			.replace('!define VERSIONMAJOR 0', '!define VERSIONMAJOR ' + MAJOR_VERSION)
			.replace('!define VERSIONMINOR 0', '!define VERSIONMINOR ' + MINOR_VERSION)
			.replace('!define VERSIONBUILD 0', '!define VERSIONBUILD ' + BUILD_VERSION);

		/* IN ORDER TO CHANGE TASK MANAGER NAME */
    var options = {
        'version-string': {
						// 'CompanyName': 'Redkix',
            'FileDescription': 'Redkix Desktop Client'
						// 'ProductName': 'Redkix Desktop Client'
        }
    };

    var callback = function() {};

    rcedit('./Redkix-win32-ia32/Redkix.exe', options, callback);

    rcedit('./Redkix Staging-win32-ia32/Redkix Staging.exe', options, callback);

    rcedit('./Redkix Integration-win32-ia32/Redkix Integration.exe', options, callback);

    rcedit('./Redkix Nightly-win32-ia32/Redkix Nightly.exe', options, callback);

    rcedit('./Redkix localhost-win32-ia32/Redkix localhost.exe', options, callback);

    rcedit('./Redkix Gmail-win32-ia32/Redkix Gmail.exe', options, callback);

    fs.writeFileSync('./Redkix-win32-ia32/createInstaller.nsi', production, 'utf8');

    fs.writeFileSync('./Redkix Staging-win32-ia32/createInstaller.nsi', staging, 'utf8');

    fs.writeFileSync('./Redkix Integration-win32-ia32/createInstaller.nsi', integration, 'utf8');

    fs.writeFileSync('./Redkix Nightly-win32-ia32/createInstaller.nsi', nightly, 'utf8');

    fs.writeFileSync('./Redkix localhost-win32-ia32/createInstaller.nsi', localhost, 'utf8');

    fs.writeFileSync('./Redkix Gmail-win32-ia32/createInstaller.nsi', gmail, 'utf8');

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

    console.log('Building gmail desktop Installer...');
    exec('"C:\\Program Files (x86)\\NSIS\\makensis.exe" "Redkix Gmail-win32-ia32\\createInstaller.nsi"');
    console.log('DONE'.green);

    console.log('BUILD INSTALLERS PHASE DONE'.black.bgMagenta);

    console.log('BUILD FINISHED'.greenBg);

    exec('rmdir WIN_x32 /s /q');

    mkdirp('./WIN_x32', function(err) {

        fs.copySync('./Redkix-win32-ia32/Redkix Installer.exe', './WIN_x32/Redkix Installer.exe');
        fs.copySync('./Redkix Staging-win32-ia32/Redkix Staging Installer.exe', './WIN_x32/Redkix Staging Installer.exe');
        fs.copySync('./Redkix Integration-win32-ia32/Redkix Integration Installer.exe', './WIN_x32/Redkix Integration Installer.exe');
        fs.copySync('./Redkix Nightly-win32-ia32/Redkix Nightly Installer.exe', './WIN_x32/Redkix Nightly Installer.exe');
        fs.copySync('./Redkix localhost-win32-ia32/Redkix localhost Installer.exe', './WIN_x32/Redkix localhost Installer.exe');
        fs.copySync('./Redkix Gmail-win32-ia32/Redkix Gmail Installer.exe', './WIN_x32/Redkix Gmail Installer.exe');

        console.log('SIGN CERTIFICATE PHASE STARTED'.bgRed.black);
        exec('signtool.exe sign /t http://timestamp.digicert.com /f redkix.p12 /p 56784321 "WIN_x32\\Redkix Installer.exe"');
        exec('signtool.exe sign /t http://timestamp.digicert.com /f redkix.p12 /p 56784321 "WIN_x32\\Redkix Staging Installer.exe"');
        exec('signtool.exe sign /t http://timestamp.digicert.com /f redkix.p12 /p 56784321 "WIN_x32\\Redkix Integration Installer.exe"');
        exec('signtool.exe sign /t http://timestamp.digicert.com /f redkix.p12 /p 56784321 "WIN_x32\\Redkix Nightly Installer.exe"');
        exec('signtool.exe sign /t http://timestamp.digicert.com /f redkix.p12 /p 56784321 "WIN_x32\\Redkix localhost Installer.exe"');
        exec('signtool.exe sign /t http://timestamp.digicert.com /f redkix.p12 /p 56784321 "WIN_x32\\Redkix Gmail Installer.exe"');
        console.log('SIGN CERTIFICATE PHASE FINISHED'.bgRed.black);

    });
} else {
    console.log('Building for OS X x64'.bgYellow.black);

    var buildProduction = 'nativefier --name "Redkix" "https://beta.redkix.com/" --icon "assets/Production.icns" --counter --maximize';
    var buildStaging = 'nativefier --name "Redkix Staging" "https://staging.redkix.com/" --icon "assets/Staging.icns" --counter --maximize';
    var buildIntegration = 'nativefier --name "Redkix Integration" "https://int.redkix.com/" --icon "assets/Integration.icns" --counter --maximize';
    var buildNightly = 'nativefier --name "Redkix Nightly" "https://nightly.redkix.com/" --icon "assets/Dev.icns" --counter --maximize';
    var buildLocalhost = 'nativefier --name "Redkix localhost" "http://0.0.0.0:9000/" --icon "assets/Dev.icns" --counter --maximize';
    var buildGmail = 'nativefier --name "Redkix Gmail" "http://gmail.redkix.com/" --icon "assets/redkixGmail.icns" --counter --maximize';

    console.log('BUILD LATEST NATIVEFIER AND CREATE GLOBAL VARIABLE'.black.bgRed);
// exec('npm run dev-up');
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

    console.log('Building gmail desktop wrapper...');
    exec(buildGmail);
    console.log('DONE'.green);

    console.log('BUILD PHASE DONE'.black.bgCyan);

    console.log('CODE SIGN THE APPS'.black.bgWhite);
// only signing PRODUCTION, STAGING, & INTEGRATION. NIGHTLY AND LOCAL AREN'T SIGNED
    exec('codesign --deep --force --strict --sign "4J484N4UCL" "Redkix-darwin-x64/Redkix.app"');
    exec('codesign --deep --force --strict --sign "4J484N4UCL" "Redkix Staging-darwin-x64/Redkix Staging.app"');
    exec('codesign --deep --force --strict --sign "4J484N4UCL" "Redkix Integration-darwin-x64/Redkix Integration.app"');
    exec('codesign --deep --force --strict --sign "4J484N4UCL" "Redkix Gmail-darwin-x64/Redkix Gmail.app"');
    console.log('DONE'.green);

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
    console.log('Building Gmail desktop Installer...');
    exec('dropdmg --config-name=Redkix "Redkix Gmail-darwin-x64/Redkix Gmail.app"');
    console.log('DONE'.green);

    exec('rm -r ./OS_X_x64');

    mkdirp('./OS_X_x64', function(err) {

        fs.copySync('./Redkix-darwin-x64/Redkix.dmg', './OS_X_x64/Redkix.dmg');
        fs.copySync('./Redkix Staging-darwin-x64/Redkix Staging.dmg', './OS_X_x64/Redkix Staging.dmg');
        fs.copySync('./Redkix Integration-darwin-x64/Redkix Integration.dmg', './OS_X_x64/Redkix Integration.dmg');
        fs.copySync('./Redkix Nightly-darwin-x64/Redkix Nightly.dmg', './OS_X_x64/Redkix Nightly.dmg');
        fs.copySync('./Redkix localhost-darwin-x64/Redkix localhost.dmg', './OS_X_x64/Redkix localhost.dmg');
        fs.copySync('./Redkix Gmail-darwin-x64/Redkix Gmail.dmg', './OS_X_x64/Redkix Gmail.dmg');

    });
}
