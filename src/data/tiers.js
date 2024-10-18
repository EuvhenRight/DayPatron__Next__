import PropTypes from 'prop-types';

const tiers = [
  { code: 'New', label: 'New' },
  { code: 'Vetted', label: 'Vetted' },
];

tiers.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default tiers;