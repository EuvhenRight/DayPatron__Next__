import PropTypes from 'prop-types';

const invoiceStatus = [
  { code: 'Draft', label: 'Draft' },
  { code: 'Pending', label: 'Pending' },
  { code: 'SentToAccountant', label: 'SentToAccountant' },
  { code: 'Paid', label: 'Paid' },
];

invoiceStatus.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default invoiceStatus;