/* global chrome */

function hasChromeI18N() {
  return (typeof chrome === 'object') &&
    chrome.i18n &&
    chrome.i18n.getMessage;
}

export function initialize(appInstance) {
  const i18n = appInstance.lookup('service:i18n');
  const lang = hasChromeI18N() ? chrome.i18n.getMessage('lang_code') : 'en';
  i18n.set('locale', lang);
}

export default {
  name: 'i18n',
  initialize
};
