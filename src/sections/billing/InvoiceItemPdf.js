import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

const textPrimary = '#262626';

const styles = StyleSheet.create({
  table: {
    width: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    fontSize: 10
  },
  borderBottom: {
    borderBottom: '1px solid #EEE',
  },
  header: {
    borderTop: 'none'
  },
  column1: {
    width: '50%'
  },
  column2: {
    width: '15%'
  },
  column3: {
    width: '15%'
  },
  column4: {
    width: '20%',
    textAlign: 'right'
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
        <View style={[styles.row, styles.header, styles.borderBottom]}>
          <Text style={[styles.column1, styles.text]}>Description</Text>
          <Text style={[styles.column2, styles.text]}>Quantity</Text>
          <Text style={[styles.column3, styles.text]}>Price</Text>
          <Text style={[styles.column4, styles.text]}>Amount excl. VAT</Text>
        </View>
        {invoice.invoiceItems.map((invoiceItem, index) => (
          <View key={index} style={styles.row} wrap={false}>
            <Text style={[styles.column1, styles.text]}>{
              invoiceItem?.description}. Period: {invoice?.startDate && format(new Date(invoice?.startDate), "dd-MM-yyyy")} - {invoice?.endDate && format(new Date(invoice?.endDate), "dd-MM-yyyy")}
            </Text>
            <Text style={[styles.column2, styles.text]}>{
              invoiceItem?.rateType === "Hourly" ?
                invoiceItem?.quantity.toFixed(2) + " hours" :
                invoiceItem?.rateType === "Daily" ?
                  invoiceItem?.quantity.toFixed(2) + " days" :
                  invoiceItem?.quantity}
            </Text>
            <Text style={[styles.column3, styles.text]}>€ {invoiceItem?.unitPrice.toFixed(2).replace(".", ",")}</Text>
            <Text style={[styles.column4, styles.text]}>€ {invoiceItem?.totalAmount.toFixed(2).replace(".", ",")}</Text>
          </View>
        )
        )}
      </View>
    </>
  )
}

InvoiceItemPdf.propTypes = {
  invoice: PropTypes.object
}

export default InvoiceItemPdf;