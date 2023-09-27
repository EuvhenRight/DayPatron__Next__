import PropTypes from 'prop-types';
import { Page, Document, StyleSheet } from '@react-pdf/renderer';

import InvoiceHeaderPdf from 'sections/billing/InvoiceHeaderPdf';
import InvoiceCounterPartyPdf from './InvoiceCounterPartyPdf';
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
        <InvoiceHeaderPdf counterParty={invoice.creditor} />
        <InvoiceEmptyRowsPdf rows={1} />
        <InvoiceCounterPartyPdf counterParty={invoice.debtor} />
        <InvoiceEmptyRowsPdf rows={1} />
        <InvoiceNumberPdf invoice={invoice} invoiceTypeMessage="Invoice" />
        <InvoiceEmptyRowsPdf rows={2} />
        <InvoiceItemPdf invoice={invoice} />
        <InvoiceEmptyRowsPdf rows={8} />
        <InvoiceTotalPdf invoice={invoice} />
        <InvoiceEmptyRowsPdf rows={2} />
        <InvoiceMessagePdf message="THANK YOU FOR YOUR BUSINESS!" />
        <InvoiceFooterPdf />
      </Page >
    </Document >
  );
}

RegularInvoicePdf.propTypes = {
  invoice: PropTypes.object
};

export default RegularInvoicePdf;