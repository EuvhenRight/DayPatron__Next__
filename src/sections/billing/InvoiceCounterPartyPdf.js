import { StyleSheet, Text, View } from '@react-pdf/renderer';
import PropTypes from 'prop-types';
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

const InvoiceCounterPartyPdf = ({ counterParty }) => {

  return (
    <>
      <View style={styles.column}>
        <View style={styles.row}>
          <View style={styles.start}>
            <Text style={styles.text}>{counterParty?.legalEntityName}</Text>
            {
              (counterParty?.firstName != null || counterParty?.lastName != null) &&
              <Text style={styles.text}>{counterParty?.firstName} {counterParty?.lastName}</Text>
            }
            <Text style={styles.text}>{counterParty?.address?.street} {counterParty?.address?.streetNumber}</Text>
            <Text style={styles.text}>{counterParty?.address?.postCode} {counterParty?.address?.city}</Text>
            <Text style={styles.text}>{countries.find(x => x.code === counterParty?.address?.country)?.label}</Text>
          </View>
        </View>
      </View>
    </>
  )
}

InvoiceCounterPartyPdf.propTypes = {
  counterParty: PropTypes.object
}

export default InvoiceCounterPartyPdf;