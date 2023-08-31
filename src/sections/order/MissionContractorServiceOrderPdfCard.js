import PropTypes from 'prop-types';

// third-party
import { Page, View, Document, StyleSheet, Text } from '@react-pdf/renderer';

const textPrimary = '#262626';
const textSecondary = '#8c8c8c';
const border = '#f0f0f0';

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  container: {
    border: `1px solid ${border}`,
    padding: 18,
    flexDirection: 'column',
    '@media max-width: 400': {
      flexDirection: 'column'
    }
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  CardInfo: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    fontSize: 14,
    lineHeight: 1.57,
    color: textPrimary
  },
  role: {
    fontSize: 10,
    lineHeight: 1.66,
    color: textSecondary
  },
  hr: {
    borderBottom: `1px solid ${border}`,
    paddingTop: 18
    // paddingBottom: 18
  },
  about: {
    paddingTop: 18,
    fontSize: 14,
    lineHeight: 1.57,
    fontWeight: 'demibold',
    color: textPrimary,
    paddingBottom: 18
  },
  IconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  IconRow: {
    width: '48%',
    gap: 10,
    paddingBottom: 10
  },
  icon: {
    width: 12,
    height: 10
  },
  iconTitle: {
    fontSize: 10,
    lineHeight: 1.57,
    color: textSecondary
  },
  chip: {
    border: `1px solid ${textSecondary}`,
    alignItems: 'center',
    borderRadius: '4px',
    marginLeft: 4,
    marginRight: 4,
    marginBottom: 8
  },
  chipTitle: {
    color: textSecondary,
    fontSize: '10px',
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 4,
    paddingTop: 4
  },
  timer: {
    marginTop: 25
  }
});

const MissionContractorServiceOrderPdfCard = ({ order }) => {
  return (
    <Document title={`${order?.id}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.row}>
            <View style={styles.CardInfo}>
              <Text style={styles.title}>{order?.missionTitle}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

MissionContractorServiceOrderPdfCard.propTypes = {
  order: PropTypes.object
};

export default MissionContractorServiceOrderPdfCard;
