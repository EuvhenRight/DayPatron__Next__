import PropTypes from 'prop-types';
import { StyleSheet, Text } from '@react-pdf/renderer';

const InvoiceMessagePdf = ({ message, fontSize, textColor }) => {

  const styles = StyleSheet.create({
    text: {
      fontSize: fontSize,
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