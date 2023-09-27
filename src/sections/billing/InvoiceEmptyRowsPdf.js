import PropTypes from 'prop-types';
import { Text } from '@react-pdf/renderer'

const InvoiceEmptyRowsPdf = ({ rows }) => {

  const blankRows = Array(rows).fill(0);

  return (
    <>
      {
        blankRows.map((row) => (
          <Text key={row}> </Text>
        ))
      };
    </>
  )
}

InvoiceEmptyRowsPdf.propTypes = {
  row: PropTypes.number
}

export default InvoiceEmptyRowsPdf