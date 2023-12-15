import PropTypes from 'prop-types';

const rateTypes = [
  { code: 'Hourly', label: 'Hourly', itemLabel: 'hour' },
  { code: 'Daily', label: 'Daily', itemLabel: 'day' },
  { code: 'Monthly', label: 'Monthly', itemLabel: 'month' },
  { code: 'Fixed', label: 'Fixed', itemLabel: null }
];

rateTypes.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string,
  laitemLabelbel: PropTypes.string
};

export default rateTypes;
