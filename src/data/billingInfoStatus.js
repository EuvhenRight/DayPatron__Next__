import PropTypes from 'prop-types';

const billingInfoStatus = [
  { code: 'Draft', label: 'Draft' },
  { code: 'Pending', label: 'Pending' },
  { code: 'SentToAccountant', label: 'SentToAccountant' },
  { code: 'Paid', label: 'Paid' },
];

billingInfoStatus.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default billingInfoStatus;
