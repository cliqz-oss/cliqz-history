/* global chrome */
export function initialize(appInstance) {
  const i18n = appInstance.lookup('service:i18n');
  const lang = typeof chrome !== 'object' ? 'en' :
    chrome.i18n.getMessage('lang_code');
  i18n.set('locale', lang);
}

export default {
  name: 'i18n',
  initialize
};
