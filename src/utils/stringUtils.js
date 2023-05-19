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

export { normalizeInputValue, normalizeNullableInputValue, normalizeBooleanInputValue, prepareApiBody };
