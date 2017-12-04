/* global chrome */
/*eslint no-console: ["error", { allow: ["warn", "error"] }] */
import Ember from "ember";

function waitForChrome(callback) {
  if (typeof chrome !== 'object') {
    setTimeout(() => waitForChrome(callback), 50);
  } else {
    callback(chrome);
  }
}

export default Ember.Route.extend({
  beforeModel() {
    return new Ember.RSVP.Promise((resolve) => {
      waitForChrome(resolve);
    });
  }
});

