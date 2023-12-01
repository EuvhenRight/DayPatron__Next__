import PropTypes from 'prop-types';

const rateTypes = [
  { code: 'Hourly', label: 'Hourly' },
  { code: 'Daily', label: 'Daily' },
  { code: 'Monthly', label: 'Monthly' },
  { code: 'Fixed', label: 'Fixed' }
];

rateTypes.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default rateTypes;
