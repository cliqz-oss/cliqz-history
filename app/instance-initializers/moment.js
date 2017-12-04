/* global chrome */

function hasChromeI18N() {
  return (typeof chrome === 'object') &&
    chrome.i18n &&
    chrome.i18n.getMessage;
}

export function initialize(appInstance) {
  const moment = appInstance.lookup('service:moment');
  const lang = hasChromeI18N() ? chrome.i18n.getMessage('lang_code') : 'en';
  moment.setLocale(lang);
}

export default {
  name: 'moment',
  initialize
};
