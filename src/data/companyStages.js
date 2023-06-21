import PropTypes from 'prop-types';

const companyStages = [
  { code: 'StartUp', label: 'Start Up' },
  { code: 'ScaleUp', label: 'Scale Up' },
  { code: 'Corporate', label: 'Corporate' }
];

companyStages.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default companyStages;
