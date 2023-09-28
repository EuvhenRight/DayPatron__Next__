import PropTypes from 'prop-types';
import { StyleSheet, Text } from '@react-pdf/renderer';

const textTitle = '#3c3ec5';

const styles = StyleSheet.create({
  text: {
    fontSize: 12,
    color: textTitle
  }
})

const InvoiceMessagePdf = ({ message }) => {

  return (
    <Text style={styles.text}>{message}</Text>
  )
}

InvoiceMessagePdf.propType = {
  message: PropTypes.string
}

export default InvoiceMessagePdf;