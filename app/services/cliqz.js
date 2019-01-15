/* global chrome */

import Ember from 'ember';
import spanan from 'npm:spanan';

const Spanan = spanan.default;

function createSpananForModule(moduleName) {
  const spanan = new Spanan(({ uuid, action, args }) => {
    const message = {
      module: moduleName,
      action,
      requestId: uuid,
      args
    };
    const onResponse = (response) => {
      if (!response) {
        return;
      }
      spanan.handleMessage({
        uuid,
        response: response.response
      });
    };

    const promise = chrome.runtime.sendMessage(message, onResponse);

    if (promise && promise.then) {
      promise.then(onResponse);
    }
  });

  chrome.runtime.onMessage.addListener(
    ({ requestId, response }) => spanan.handleMessage({
      uuid: requestId,
      response,
    })
  );

  return spanan;
}

export default Ember.Service.extend({
  historySync: Ember.inject.service('history-sync'),

  init() {
    this._super(...arguments);

    const history = createSpananForModule('history');
    const historyProxy = history.createProxy();
    this.deleteVisit = historyProxy.deleteVisit;
    this.deleteVisits = historyProxy.deleteVisits;
    this.showHistoryDeletionPopup = historyProxy.showHistoryDeletionPopup;
    this.sendUserFeedback = historyProxy.sendUserFeedback;
    this.getHistory = historyProxy.getHistory;
    this.openNewTab = historyProxy.newTab.bind(historyProxy, true);
    this.getQuery = historyProxy.getQuery;
    this.getQueries = historyProxy.getQueries;
    this.openUrl = historyProxy.openUrl;
    this.selectTabAtIndex = historyProxy.selectTabAtIndex;

    const core = createSpananForModule('core');
    const coreProxy = core.createProxy();
    this.getCliqzStatus = coreProxy.status;
    this.queryCliqz = coreProxy.queryCliqz;
    this.redoQuery = coreProxy.redoQuery;
    this.sendTelemetry = coreProxy.sendTelemetry;
    this.openFeedbackPage = coreProxy.openFeedbackPage;
  },
});
