function normalizeInputValue(value) {
  return value ? value : '';
}

function normalizeNullableInputValue(value) {
  return value ? value : null;
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

function getEllipsis(str, charactersCount) {
  if (!str)
    return null;

  var result = str?.length <= charactersCount ? str : str.substring(0, charactersCount - 3) + '...';

  return result;
}

export { normalizeInputValue, normalizeNullableInputValue, prepareApiBody, removeEmptyOrNull, getEllipsis };
