import PropTypes from 'prop-types';

const currencies = [
  { code: 'EUR', symbol: '\u20AC', regionCode: 'EU' },
  { code: 'USD', symbol: '\u0024', regionCode: 'US' },
  { code: 'GBP', symbol: '\u00A3', regionCode: 'GB' },
  { code: 'JPY', symbol: '\u00A5', regionCode: 'JP' }
];

currencies.propTypes = {
  code: PropTypes.string,
  symbol: PropTypes.string
};

export default currencies;