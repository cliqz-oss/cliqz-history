/* global chrome */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Ember from "ember";

function waitForChrome(callback) {
  if (typeof chrome !== 'object') {
    setTimeout(() => waitForChrome(callback), 50);
  } else {
    callback(chrome);
  }
}

export default Ember.Route.extend({
  moment: Ember.inject.service('moment'),
  i18n: Ember.inject.service('i18n'),
  beforeModel() {
    return new Ember.RSVP.Promise((resolve) => {
      waitForChrome((chrome) => {
        const i18n = this.get('i18n');
        const moment = this.get('moment');
        const lang = chrome.i18n.getMessage('lang_code') || 'en';
        i18n.set('locale', lang);
        moment.setLocale(lang);
        document.title = i18n.t('history.tab-title');
        resolve();
      });
    });
  }
});

