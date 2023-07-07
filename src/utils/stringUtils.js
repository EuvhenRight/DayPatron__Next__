function normalizeInputValue(value) {
  return value ? value : '';
}

function normalizeNullableInputValue(value) {
  return value ? value : null;
}

function normalizeBooleanInputValue(value) {
  return value ? value : false;
}

function prepareApiBody(obj) {
  return JSON.stringify(removeEmptyOrNull(obj));
}

function removeEmptyOrNull(obj) {
  Object.keys(obj).forEach(k =>
    (obj[k] && typeof obj[k] === 'object') && removeEmptyOrNull(obj[k]) ||
    (!obj[k] && obj[k] !== undefined) && delete obj[k]
  );

  return obj;
}

function dateTimeToTimeString(dateTimeString) {
  var dateTime = new Date(dateTimeString);
  var result =
    dateTime.getHours().toString().padStart(2, '0') + ':' +
    dateTime.getMinutes().toString().padStart(2, '0') + ':' +
    dateTime.getSeconds().toString().padStart(2, '0');

  return result;
}

function compareSortValues(a, b) {
  var result = (a ?? '')?.localeCompare(b ?? '');

  return result;
}

export { normalizeInputValue, normalizeNullableInputValue, normalizeBooleanInputValue, prepareApiBody, dateTimeToTimeString, compareSortValues };
