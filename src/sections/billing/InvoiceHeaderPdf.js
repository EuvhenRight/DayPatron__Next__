import { StyleSheet, Text, View, Image } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import Logo from 'assets/images/logo.png';
import countries from 'data/countries';

import InvoiceEmptyRowsPdf from 'sections/billing/InvoiceEmptyRowsPdf';

const textPrimary = '#262626';

const styles = StyleSheet.create({
  table: {
    width: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: 10
  },
  column1: {
    width: '68%'
  },
  column2: {
    width: '14%'
  },
  column3: {
    width: '18%'
  },
  text: {
    fontSize: 11,
    lineHeight: 1.2,
    color: textPrimary
  },
  textBody1: {
    fontSize: 8,
    lineHeight: 1.2,
    color: textPrimary
  },
  rowLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16
  },
  half: {
    width: '50%'
  },
  columnLogo: {
    flexDirection: 'column',
    gap: 16
  },
  logo: {
    width: 75
  },
  column: {
    flexDirection: 'column'
  }
})

const InvoiceHeaderPdf = ({ counterParty }) => {

  return (
    <>
      <View style={styles.columnLogo}>
        <View style={styles.rowLogo}>
          <View style={styles.half}>
            <Image src={Logo} style={styles.logo} />
          </View>
          <View style={styles.column}>
            <Text style={styles.text}>{counterParty?.legalEntityName}</Text>
            <Text style={styles.text}>{counterParty?.address?.street} {counterParty?.address?.streetNumber}</Text>
            <Text style={styles.text}>{counterParty?.address?.postCode} {counterParty?.address?.city}</Text>
            <Text style={styles.text}>{countries.find(x => x.code === counterParty?.address?.country)?.label}</Text>
          </View>
        </View>
      </View>
      <InvoiceEmptyRowsPdf rows={1} />
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.column1}> </Text>
          <Text style={[styles.column2, styles.textBody1]}>IBAN:</Text>
          <Text style={[styles.column3, styles.textBody1]}>{counterParty?.bankAccountNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.column1}> </Text>
          <Text style={[styles.column2, styles.textBody1]}>Swift Code:</Text>
          <Text style={[styles.column3, styles.textBody1]}>BUNQNL2A</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.column1}> </Text>
          <Text style={[styles.column2, styles.textBody1]}>CoC:</Text>
          <Text style={[styles.column3, styles.textBody1]}>{counterParty?.chamberOfCommerceIdentifier}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.column1}> </Text>
          <Text style={[styles.column2, styles.textBody1]}>VAT Number:</Text>
          <Text style={[styles.column3, styles.textBody1]}>{counterParty?.vatNumber}</Text>
        </View>
      </View>
    </>
  )
}

InvoiceHeaderPdf.propTypes = {
  counterParty: PropTypes.object
}

export default InvoiceHeaderPdf;