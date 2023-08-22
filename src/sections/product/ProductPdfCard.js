import PropTypes from 'prop-types';

// third-party
import { Page, View, Document, StyleSheet, Image, Text } from '@react-pdf/renderer';

import Maps from 'assets/images/icons/map.png';
import countries from 'data/countries';

const avatarImage = require.context('assets/images/products', true);
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

const ProductPdfCard = ({ product }) => {
  return (
    <Document title={`${product?.title}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.row}>
            <Image style={styles.image} src={product.mainImageUrl ? product.mainImageUrl : avatarImage('./default.png')} />
            <View style={styles.CardInfo}>
              <Text style={styles.title}>{product.title}</Text>
            </View>
          </View>
          <View style={styles.hr} />
          <View>
            <Text style={styles.about}>{product.description}</Text>
          </View>
          <View style={styles.IconContainer}>
            <View style={[styles.row, styles.IconRow]}>
              <Image src={Maps} style={styles.icon} />
              <Text style={styles.iconTitle}>{countries.find(x => x.code === product.country)?.label}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

ProductPdfCard.propTypes = {
  product: PropTypes.object
};

export default ProductPdfCard;
