import Ember from 'ember';

function isURLShortener(url) {
  return !!url.match(SHORTENERS_RE);
}

function worthShowing(visit) {
  return visit.get('title').trim() !== '' &&
         !isURLShortener(visit.get('url'));
}

function lookAlike(visit1, visit2) {
  const SCHEME_WWW_RE = /^([a-z0-9]+:([/]+)?)?(www\.)?/i;
  const HASH_RE = /#[^#]+$/;
  let url1 = visit1.get('url');
  let url2 = visit2.get('url');
  // remove protocol, trailing "www." and hash (?)
  url1 = url1.replace(SCHEME_WWW_RE, '').replace(HASH_RE, '');
  url2 = url2.replace(SCHEME_WWW_RE, '').replace(HASH_RE, '');
  return url1 === url2;
}

export default Ember.Component.extend({
  classNameBindings: ['query:is-active', 'hasOngoingVisits:has-ongoing-visits',
    'isMarkedForDeletion:marked-for-deletion'],

  history: Ember.inject.service('history-sync'),

  visitsSorting: ['lastVisitedAt:asc'],
  visits: Ember.computed.sort('model.visits', 'visitsSorting'),

  entryVisit: Ember.computed.alias('visits.firstObject'),

  sortedVisits: Ember.computed('visits', function () {
    const visits = this.get('visits');
    return visits.slice(1, visits.length);
  }),

  clusters: Ember.computed('visits', function() {
    let currentCluster = null;
    const clusters = [];

    this.get('visits').reduce((prevVisit, currVisit) => {
      if (prevVisit === null ||
          worthShowing(prevVisit) && !lookAlike(prevVisit, currVisit)) {
        // create new cluster for first or unique visits
        currentCluster = [currVisit];
        clusters.push(currentCluster);
      } else {
        // add currVisit to current cluster as a new head
        currentCluster.push(currVisit);
      }
      return currVisit;
    }, null);

    // mark clusters' heads
    clusters.forEach(cluster => cluster[cluster.length - 1].set('isMain', true));

    return clusters;
  }),

  ongoingVisits: Ember.computed.filter('visits', function (visit) {
    return typeof visit.get('tabIndex') === "number";
  }),

  hasOngoingVisits: Ember.computed.gt('ongoingVisits.length', 0),

  hasNoSortedVisits: Ember.computed.equal('sortedVisits.length', 0),

  actions: {
    deleteVisit(visit) {
      this.get('history').deleteVisit(visit.get('id'));
    },
    deleteSession() {
      this.$().fadeOut(500, function() {
        this.get('history').deleteSession(this.get('model.id'));
      }.bind(this));
    },
    markForDeletion() {
      this.set("isMarkedForDeletion", true);
    },
    unMarkForDeletion() {
      this.set("isMarkedForDeletion", false);
    },
  }
});

const SHORTENERS = [
  "amp.gs",
  "bit.do",
  "t.co",
  "lnkd.in",
  "db.tt",
  "qr.ae",
  "adf.ly",
  "goo.gl",
  "bitly.com",
  "cur.lv",
  "tinyurl.com",
  "ow.ly",
  "bit.ly",
  "ity.im",
  "q.gs",
  "is.gd",
  "po.st",
  "bc.vc",
  "twitthis.com",
  "u.to",
  "j.mp",
  "buzurl.com",
  "cutt.us",
  "u.bb",
  "yourls.org",
  "x.co",
  "prettylinkpro.com",
  "scrnch.me",
  "filoops.info",
  "vzturl.com",
  "qr.net",
  "1url.com",
  "tweez.me",
  "v.gd",
  "tr.im",
  "link.zip.net",
  "tinyarrows.com",
  "youtu.be",
].map(s => `(${s})`).join('|').replace(/\./g, '\\.');

const SHORTENERS_RE = new RegExp(`^([a-z0-9]+:[/]*)?(${SHORTENERS})\\/[^/?#]+$`, 'gi');