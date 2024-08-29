import PropTypes from 'prop-types';

const userTypes = [
  { code: 'Admin', label: 'Community Manager' },
  { code: 'Contractor', label: 'Talent' },
  { code: 'EmployerUser', label: 'Company User' },
  
];

userTypes.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default userTypes;
