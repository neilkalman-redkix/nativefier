import wurl from 'wurl';
import os from 'os';
import fs from 'fs';
import path from 'path';

const INJECT_CSS_PATH = path.join(__dirname, '..', 'inject/inject.css');

function isOSX() {
    return os.platform() === 'darwin';
}

function isLinux() {
    return os.platform() === 'linux';
}

function isWindows() {
    return os.platform() === 'win32';
}

function linkIsInternal(currentUrl, newUrl) {
    var currentDomain = wurl('domain', currentUrl);
    var newDomain = wurl('domain', newUrl);
    return newUrl.indexOf('nightly.redkix.com') !== -1 ||
      newUrl.indexOf('int.redkix.com') !== -1 ||
      newUrl.indexOf('staging.redkix.com') !== -1 ||
      newUrl.indexOf('gmail.redkix.com') !== -1 ||
      newUrl.indexOf('beta.redkix.com') !== -1 ||
      newUrl.indexOf('10.0.0.108:9000') !== -1 ||
      newUrl.indexOf('0.0.0.0:9000') !== -1;
}

function getCssToInject() {
    const needToInject = fs.existsSync(INJECT_CSS_PATH);
    if (!needToInject) {
        return '';
    }
    return fs.readFileSync(INJECT_CSS_PATH).toString();
}

export default {
    isOSX,
    isLinux,
    isWindows,
    linkIsInternal,
    getCssToInject
};
