import PropTypes from 'prop-types';
import RegularInvoicePdf from 'sections/billing/RegularInvoicePdf';
import ReversedInvoicePdf from 'sections/billing/ReversedInvoicePdf';

const InvoicePdf = ({ invoice }) => {

  if (invoice.invoiceType === 'Regular') {
    return (
      <RegularInvoicePdf invoice={invoice} />
    )
  }
  if (invoice.invoiceType === 'Reversed') {
    return (
      <ReversedInvoicePdf invoice={invoice} />
    )
  }
}

InvoicePdf.propTypes = {
  invoice: PropTypes.object
};

export default InvoicePdf