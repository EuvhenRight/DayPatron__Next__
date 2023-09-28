import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const textPrimary = '#262626';

const styles = StyleSheet.create({
  table: {
    width: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 10
  },
  header: {
    borderTop: 'none'
  },
  bold: {
    fontWeight: 'bold'
  },
  row1: {
    width: '40%'
  },
  row2: {
    width: '20%'
  },
  row3: {
    width: '20%'
  },
  row4: {
    width: '20%',
    textAlign: 'right'
  },
  fontSize: {
    fontSize: 10
  },
  text: {
    fontSize: 11,
    lineHeight: 1.2,
    color: textPrimary
  }
})

const InvoiceTotalPdf = ({ invoice, vatPercentage }) => {

  return (
    <>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.row1}> </Text>
          <Text style={[styles.row2, styles.text]}>Total excluding VAT</Text>
          <Text style={styles.row3}> </Text>
          <Text style={[styles.row4, styles.text]}>€ {invoice?.totalAmountExcludingVat.toFixed(2).replace(".", ",")}</Text>
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.row1}> </Text>
          <Text style={[styles.row2, styles.text]}>VAT {vatPercentage}%</Text>
          <Text style={styles.row3}></Text>
          <Text style={[styles.row4, styles.text]}>€ {invoice?.vatAmount.toFixed(2).replace(".", ",")}</Text>
        </View>
      </View>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.row1}> </Text>
          <Text style={[styles.row2, styles.text]}>Total including VAT</Text>
          <Text style={styles.row3}> </Text>
          <Text style={[styles.row4, styles.text]}>€ {invoice?.totalAmountIncludingVat.toFixed(2).replace(".", ",")}</Text>
        </View>
      </View>
    </>
  )
}

InvoiceTotalPdf.propTypes = {
  invoice: PropTypes.object,
  vatPercentage: PropTypes.number
}

export default InvoiceTotalPdf