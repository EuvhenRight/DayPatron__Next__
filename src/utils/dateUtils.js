function getDatesInRange(startDateRange, endDateRange) {
  var result = [];
  let newStartDateRange = new Date(startDateRange);
  let newEndDateRange = new Date(endDateRange);

  for (var newDate = newStartDateRange; newDate <= newEndDateRange; newDate.setDate(newDate.getDate() + 1)) {
    result.push(new Date(newDate));
  }

  return result;
}

export { getDatesInRange };
