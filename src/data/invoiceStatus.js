import PropTypes from 'prop-types';

const invoiceStatus = [
  { code: 'Pending', label: 'Pending' },
  { code: 'SentToAccountant', label: 'SentToAccountant' },
  { code: 'Paid', label: 'Paid' },
];

invoiceStatus.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default invoiceStatus;
