import PropTypes from 'prop-types';

const financingStages = [
  { code: 'PreSeed', label: 'Pre Seed' },
  { code: 'Seed', label: 'Seed' },
  { code: 'SeriesA', label: 'Series A' },
  { code: 'SeriesB', label: 'Series B' },
  { code: 'SeriesC', label: 'Series C' },
  { code: 'SeriesD', label: 'Series D' },
  { code: 'Ipo', label: 'IPO' }
];

financingStages.propTypes = {
  code: PropTypes.string,
  label: PropTypes.string
};

export default financingStages;
