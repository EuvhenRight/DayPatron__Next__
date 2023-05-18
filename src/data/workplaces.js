import PropTypes from 'prop-types';

const workplaces = [
  { code: 'REMOTE', label: 'Remote' },
  { code: 'HYBRID', label: 'Hybrid' },
  { code: 'ONSITE', label: 'On-site' }
];

workplaces.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default workplaces;