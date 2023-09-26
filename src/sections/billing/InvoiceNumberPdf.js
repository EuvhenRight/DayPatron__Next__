import { StyleSheet, Text, View } from '@react-pdf/renderer'
import PropTypes from 'prop-types'
import { format } from 'date-fns';

const textPrimary = '#262626';
const textTitle = '#3c3ec5';

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
    width: '20%'
  },
  column2: {
    width: '80%'
  },
  text: {
    fontSize: 11,
    lineHeight: 1.2,
    color: textPrimary
  },
  h1: {
    fontSize: 26,
    lineHeight: 2,
    color: textTitle
  }
})

const InvoiceNumberPdf = ({ invoice }) => {

  return (
    <>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.column1, styles.h1]}>Invoice</Text>
          <Text style={[styles.column2, styles.text]}> </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.column1, styles.text]}>Invoice Number:</Text>
          <Text style={[styles.column2, styles.text]}>{invoice?.invoiceNumber}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.column1, styles.text]}>Invoice Date:</Text>
          <Text style={[styles.column2, styles.text]}>{invoice?.invoiceDate && format(new Date(invoice?.invoiceDate), "dd-MM-yyyy")}</Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.column1, styles.text]}>Due Date:</Text>
          <Text style={[styles.column2, styles.text]}>{invoice?.dueDate && format(new Date(invoice?.dueDate), "dd-MM-yyyy")}</Text>
        </View>
      </View>
    </>
  )
}

InvoiceNumberPdf.propTypes = {
  invoice: PropTypes.object
}

export default InvoiceNumberPdf