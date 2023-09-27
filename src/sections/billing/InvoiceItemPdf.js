import { StyleSheet, Text, View } from '@react-pdf/renderer'
import PropTypes from 'prop-types'

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
    borderTop: 'none',
  },
  bold: {
    fontWeight: 'bold',
  },
  column1: {
    width: '40%',
  },
  column2: {
    width: '20%',
  },
  column3: {
    width: '20%',
  },
  column4: {
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

const InvoiceItemPdf = ({ invoice }) => {

  return (
    <>
      <View style={styles.table}>
        <View style={[styles.row, styles.bold, styles.header]}>
          <Text style={[styles.column1, styles.text]}>Description</Text>
          <Text style={[styles.column2, styles.text]}>Quantity</Text>
          <Text style={[styles.column3, styles.text]}>Price</Text>
          <Text style={[styles.column4, styles.text]}>Amount excl. VAT</Text>
        </View>
        <View style={styles.row} wrap={false}>
          <Text style={[styles.column1, styles.text]}>{invoice?.invoiceItem?.description}</Text>
          <Text style={[styles.column2, styles.text]}>{invoice?.invoiceItem?.quantity}</Text>
          <Text style={[styles.column3, styles.text]}>€ {invoice?.invoiceItem?.unitPrice}</Text>
          <Text style={[styles.column4, styles.text]}>€ {invoice?.invoiceItem?.totalPrice}</Text>
        </View>
      </View>
    </>
  )
}

InvoiceItemPdf.propTypes = {
  invoice: PropTypes.object
}

export default InvoiceItemPdf