function normalizeInputValue(value) {
  return value ? value : '';
}

function normalizeNumberInputValue(value) {
  return value || value === 0 ? value : '';
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
    (!obj[k] && obj[k] !== undefined && obj[k] !== false) && delete obj[k]
  );
  return obj;
}  

function getCounterPartyLabel (invoiceType, counterPartyType) {
  if(invoiceType === 'Regular') {
    if(counterPartyType === 'Creditor') 
      return '10x';
    else if(counterPartyType === 'Debtor') 
      return 'Company';
  } else if(invoiceType === 'Reversed') {
    if(counterPartyType === 'Creditor') 
      return 'Talent';
    else if(counterPartyType === 'Debtor') 
      return '10x';
  }

  return counterPartyType;
}

function getEllipsis(str, charactersCount) {
  if (!str)
    return null;

  var result = str?.length <= charactersCount ? str : str.substring(0, charactersCount - 3) + '...';

  return result;
}

function compareSortValues(a, b) {
  var result = (a ?? '')?.localeCompare(b ?? '');

  return result;
}

function getHtmlInnerText(htmlString) {
  if(!htmlString)
    return null;

  var result = htmlString.replace(/<[^>]+>/g, '');

  if(result === '') return null;

  return result;
}

export { normalizeInputValue, normalizeNumberInputValue, normalizeNullableInputValue, normalizeBooleanInputValue, prepareApiBody, removeEmptyOrNull, getEllipsis, compareSortValues, getCounterPartyLabel, getHtmlInnerText };
