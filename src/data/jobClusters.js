import PropTypes from 'prop-types';

const jobClusters = [
  { code: 'Finance', label: 'Finance' },
  { code: 'General', label: 'General' },
  { code: 'Hr', label: 'HR' },
  { code: 'Legal_Risk_And_Compliance', label: 'Legal, Risk & Compliance' },
  { code: 'Marketing_And_Communications', label: 'Marketing & Communications' },
  { code: 'Operations', label: 'Operations' },
  { code: 'Product', label: 'Product' },
  { code: 'Sales_And_Business_Development', label: 'Sales & Business Development' },
  { code: 'Technology', label: 'Technology' },
  { code: 'Transformation_And_Project', label: 'Transformation & Project' }
];

jobClusters.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default jobClusters;
