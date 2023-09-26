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

const ReportTable = ({ invoiceItem }) => {

  return (
    <>
      <View style={styles.table}>
        <View style={[styles.row, styles.bold, styles.header]}>
          <Text style={styles.column1}>Description</Text>
          <Text style={styles.column2}>Quantity</Text>
          <Text style={styles.column3}>Price</Text>
          <Text style={styles.column4}>Amount excl. VAT</Text>
        </View>

        <View style={styles.row} wrap={false}>
          <Text style={styles.column1}>{invoiceItem?.invoiceItem?.description}</Text>
          <Text style={styles.column2}>{invoiceItem?.invoiceItem?.quantity}</Text>
          <Text style={styles.column3}>€ {invoiceItem?.invoiceItem?.unitPrice}</Text>
          <Text style={styles.column4}>€ {invoiceItem?.invoiceItem?.totalPrice}</Text>
        </View>
      </View>
    </>
  )
}

ReportTable.propTypes = {
  invoiceItem: PropTypes.object
}

export default ReportTable