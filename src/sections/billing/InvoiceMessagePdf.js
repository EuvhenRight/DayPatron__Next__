import PropTypes from 'prop-types';
import { StyleSheet, Text } from '@react-pdf/renderer';

const InvoiceMessagePdf = ({ message, textColor }) => {

  const styles = StyleSheet.create({
    text: {
      fontSize: 12,
      color: textColor
    }
  })

  return (
    <Text style={[styles.text]}>{message}</Text>
  )
}

InvoiceMessagePdf.propType = {
  message: PropTypes.string
}

export default InvoiceMessagePdf;