import PropTypes from 'prop-types';
import { Page, Document, StyleSheet } from '@react-pdf/renderer';

import InvoiceHeaderPdf from 'sections/billing/InvoiceHeaderPdf';
import InvoiceCounterPartyPdf from 'sections/billing/InvoiceCounterPartyPdf';
import InvoiceNumberPdf from 'sections/billing/InvoiceNumberPdf';
import InvoiceItemPdf from 'sections/billing/InvoiceItemPdf';
import InvoiceTotalPdf from 'sections/billing/InvoiceTotalPdf';
import InvoiceFooterPdf from 'sections/billing/InvoiceFooterPdf';
import InvoiceMessagePdf from 'sections/billing/InvoiceMessagePdf';
import InvoiceEmptyRowsPdf from 'sections/billing/InvoiceEmptyRowsPdf';

const styles = StyleSheet.create({
  page: {
    padding: 30
  }
});

const RegularInvoicePdf = ({ invoice }) => {

  return (
    <Document title={invoice?.invoiceNumber}>
      <Page size="A4" style={styles.page}>
        <InvoiceHeaderPdf counterParty={invoice?.debtor} />
        <InvoiceCounterPartyPdf counterParty={invoice?.creditor} />
        <InvoiceEmptyRowsPdf rows={1} />
        <InvoiceNumberPdf invoice={invoice} invoiceTypeMessage="Reversed Invoice" />
        <InvoiceEmptyRowsPdf rows={2} />
        <InvoiceItemPdf invoice={invoice} />
        <InvoiceEmptyRowsPdf rows={5 - invoice?.invoiceItems?.length ?? 0} />
        <InvoiceTotalPdf invoice={invoice} vatPercentage={invoice?.creditor?.vatPercentage} />
        <InvoiceEmptyRowsPdf rows={1} />
        <InvoiceMessagePdf message="This invoice is due as soon as the payment from the customer has been received." fontSize="10" textColor="#262626" />
        <InvoiceEmptyRowsPdf rows={1} />
        <InvoiceMessagePdf message="THANK YOU FOR YOUR BUSINESS!" fontSize="11" textColor="#3c3ec5" />
        <InvoiceFooterPdf />
      </Page >
    </Document >
  );
}

RegularInvoicePdf.propTypes = {
  invoice: PropTypes.object
};

export default RegularInvoicePdf;