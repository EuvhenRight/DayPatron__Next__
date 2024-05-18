import PropTypes from 'prop-types';

const jobRoles = [
  { code: 'ChiefExecutiveOfficer', label: 'Chief Executive Officer (CEO)' },
  { code: 'ChiefOperatingOfficer', label: 'Chief Operating Officer (COO)' },
  { code: 'ChiefFinancialOfficer', label: 'Chief Financial Officer (CFO)' },
  { code: 'ChiefInformationOfficer', label: 'Chief Information Officer (CIO)' },
  { code: 'ChiefTechnologyOfficer', label: 'Chief Technology Officer (CTO)' },
  { code: 'ChiefMarketingOfficer', label: 'Chief Marketing Officer (CMO)' },
  { code: 'ChiefHumanResourcesOfficer', label: 'Chief Human Resources Officer (CHRO)' },
  { code: 'ChiefAdministrativeOfficer', label: 'Chief Administrative Officer (CAO)' },
  { code: 'ChiefDataOfficer', label: 'Chief Data Officer (CDO)' },
  { code: 'ChiefInnovationOfficer', label: 'Chief Innovation Officer (CINO)' },
  { code: 'ChiefProductOfficer', label: 'Chief Product Officer (CPO)' },
  { code: 'ChiefKnowledgeOfficer', label: 'Chief Knowledge Officer (CKO)' },
  { code: 'ChiefSecurityOfficer', label: 'Chief Security Officer (CSO)' },
  { code: 'ChiefRevenueOfficer', label: 'Chief Revenue Officer (CRO)' },
  { code: 'ChiefExperienceOfficer', label: 'Chief Experience Officer (CXO)' },
  { code: 'ChiefCustomerOfficer', label: 'Chief Customer Officer (CCO)' },
  { code: 'ChiefCommercialOfficer', label: 'Chief Commercial Officer (CCO)' },
  { code: 'ChiefLegalOfficer', label: 'Chief Legal Officer (CLO)' },
  { code: 'Advisor', label: 'Advisor' },
  { code: 'Consultant', label: 'Consultant' },
  { code: 'ManagingDirector', label: 'Managing Director' },
  { code: 'BusinessDeveloper', label: 'Business Developer' },
  { code: 'StrategySpecialist', label: 'Strategy Specialist' },
  { code: 'Entrepreneur', label: 'Entrepreneur' },
  { code: 'Director', label: 'Director' },
  { code: 'InterimManager', label: 'Interim Manager' },
  { code: 'BoardMember', label: 'Board Member' },
  { code: 'GeneralManager', label: 'General Manager' },
  { code: 'ExecutiveManager', label: 'Executive Manager' },
  { code: 'Coach', label: 'Coach' },
  { code: 'BusinessController', label: 'Business Controller' },
  { code: 'MarketingSpecialist', label: 'Marketing Specialist' },
  { code: 'MarketingManager', label: 'Marketing Manager' },
  { code: 'SalesSpecialist', label: 'Sales Specialist' },
  { code: 'SalesManager', label: 'Sales Manager' },
  { code: 'ProgramManager', label: 'Program Manager' },
  { code: 'ProjectManager', label: 'Project Manager' },
  { code: 'ProductManager', label: 'Product Manager' },
  { code: 'ProductLead', label: 'Product Lead' },
  { code: 'ProductOwner', label: 'Product Owner' },
  { code: 'OperationsSpecialist', label: 'Operations Specialist' },
  { code: 'OperationsManager', label: 'Operations Manager' },
  { code: 'LegalSpecialist', label: 'Legal Specialist' },
  { code: 'LegalManager', label: 'Legal Manager' },
  { code: 'FinancialAuditor', label: 'Financial Auditor' },
  { code: 'FinancialSpecialist', label: 'Financial Specialist' },
  { code: 'FinancialManager', label: 'Financial Manager' },
  { code: 'DataEngineer', label: 'Data Engineer' },
  { code: 'SoftwareEngineer', label: 'Software Engineer' },
  { code: 'SeniorSoftwareEngineer', label: 'Senior Software Engineer' },
  { code: 'TechnicalLead', label: 'Technical Lead' },
  { code: 'EngineeringManager', label: 'Engineering Manager' },
  { code: 'SoftwareArchitect', label: 'Software Architect' }
];

jobRoles.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default jobRoles;