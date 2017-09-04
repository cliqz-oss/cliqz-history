import Ember from 'ember';
import { initialize } from 'cliqz-history/instance-initializers/i18n';
import { module, test } from 'qunit';
import destroyApp from '../../helpers/destroy-app';

const i18n = Ember.Service.extend({
});

module('Unit | Instance Initializer | i18n', {
  beforeEach() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.appInstance = this.application.buildInstance();
      this.application.register('service:i18n', i18n);
    });
  },
  afterEach() {
    Ember.run(this.appInstance, 'destroy');
    destroyApp(this.application);
  }
});

// Replace this with your real tests.
test('it sets locale to en', function(assert) {
  initialize(this.appInstance);
  const i18n = this.appInstance.lookup('service:i18n');

  // you would normally confirm the results of the initializer here
  assert.equal(i18n.get('locale'), 'en');
});
