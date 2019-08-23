import Ember from 'ember';

function toRegexp(text) {
  const escapedText = text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  return new RegExp(escapedText, 'gi');
}

export function highlight([text, em]) {
  if (!em) {
    return text;
  }

  var safeText = Ember.Handlebars.Utils.escapeExpression(text || '');
  const re = toRegexp(em);
  const highlighted = safeText.replace(re, function (match) {
    return `<em>${match}</em>`;
  });
  return Ember.String.htmlSafe(highlighted)
}

export default Ember.Helper.helper(highlight);
