/* global chrome */

import Ember from 'ember';
import spanan from 'npm:spanan';

const Spanan = spanan.default;

export default Ember.Service.extend({
  historySync: Ember.inject.service('history-sync'),

  init() {
    this._super(...arguments);

    const history = new Spanan(({ uuid, action, args }) => {
      const message = {
        target: 'cliqz',
        module: 'history',
        action,
        requestId: uuid,
        args,
      };
      chrome.runtime.sendMessage(message);
    });
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

    const core = new Spanan(({ uuid, action, args }) => {
      const message = {
        target: 'cliqz',
        module: 'core',
        action,
        requestId: uuid,
        args,
      };
      chrome.runtime.sendMessage(message);
    });
    const coreProxy = core.createProxy();

    this.getCliqzStatus = coreProxy.status;
    this.queryCliqz = coreProxy.queryCliqz;
    this.redoQuery = coreProxy.redoQuery;
    this.sendTelemetry = coreProxy.sendTelemetry;
    this.openFeedbackPage = coreProxy.openFeedbackPage;


    chrome.runtime.onMessage.addListener(message => {
      if(message.action === "updateHistoryUrls" && message.message) {
        this.get('historySync').updateHistoryUrls(message.message.urls);
      }

      if (message.response) {
        const spananMessage = {
          uuid: message.requestId,
          response: message.response
        };
        history.handleMessage(spananMessage);
        core.handleMesssage(spananMessage);
      }
    });
  },

});
