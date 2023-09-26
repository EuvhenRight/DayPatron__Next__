import { StyleSheet, Text, View } from '@react-pdf/renderer'
import PropTypes from 'prop-types'
import countries from 'data/countries';


const textPrimary = '#262626';


const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    gap: 16
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16
  },
  start: {
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 11,
    lineHeight: 1.2,
    color: textPrimary
  },
})

const InvoiceDebtorPdf = ({ invoice }) => {

  return (
    <>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.start}>
            <Text style={styles.text}>{invoice?.debtor?.legalEntityName}</Text>
            <Text style={styles.text}>{invoice?.debtor?.firstName}</Text>
            <Text style={styles.text}>{invoice?.debtor?.address?.street} {invoice?.debtor?.address?.streetNumber}</Text>
            <Text style={styles.text}>{invoice?.debtor?.address?.postCode} {invoice?.debtor?.address?.city}</Text>
            <Text style={styles.text}>{countries.find(x => x.code === invoice?.debtor?.address?.country)?.label}</Text>
          </View>
        </View>
      </View>
    </>
  )
}

InvoiceDebtorPdf.propTypes = {
  invoice: PropTypes.object
}

export default InvoiceDebtorPdf