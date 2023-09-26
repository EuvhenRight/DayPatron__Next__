import PropTypes from 'prop-types';
import { Page, Document, StyleSheet, Text } from '@react-pdf/renderer';

import InvoiceHeaderPdf from 'sections/billing/InvoiceHeaderPdf';
import InvoiceDebtorPdf from 'sections/billing/InvoiceDebtorPdf';
import InvoiceNumberPdf from 'sections/billing/InvoiceNumberPdf';
import InvoiceItemPdf from 'sections/billing/InvoiceItemPdf';
import InvoiceTotalPdf from 'sections/billing/InvoiceTotalPdf';
import InvoiceFooterPdf from 'sections/billing/InvoiceFooterPdf';


const textPrimary = '#262626';
const textTitle = '#3c3ec5';
const border = '#f0f0f0';

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  container: {
    border: `1px solid ${border}`,
    padding: 18,
    flexDirection: 'column',
    '@media max-width: 400': {
      flexDirection: 'column'
    }
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16
  },
  half: {
    width: '50%'
  },
  column: {
    flexDirection: 'column',
    gap: 16
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  title: {
    fontSize: 14,
    lineHeight: 1.57,
    color: textPrimary
  },
  hr: {
    borderBottom: `1px solid ${border}`,
    paddingTop: 18,
    paddingBottom: 18
  },
  logo: {
    width: 75
  },
  h2: {
    fontSize: 14,
    lineHeight: 1.2,
    color: textPrimary
  },
  h1: {
    fontSize: 26,
    lineHeight: 2,
    color: textTitle
  },
  text: {
    fontSize: 11,
    lineHeight: 1.2,
    color: textPrimary
  },
  end: {
    alignItems: 'flex-end'
  },
  start: {
    alignItems: 'flex-start'
  }
});

const RegularInvoicePdf = ({ invoice }) => {

  return (
    <Document title={invoice?.invoiceNumber}>
      <Page size="A4" style={styles.page}>

        <InvoiceHeaderPdf invoice={invoice} />

        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>

        <InvoiceDebtorPdf invoice={invoice} />

        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>

        <InvoiceNumberPdf invoice={invoice} />

        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>

        <InvoiceItemPdf invoiceItem={invoice} />

        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>

        <InvoiceTotalPdf invoice={invoice} />

        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>

        <InvoiceFooterPdf />

      </Page >
    </Document >
  );
}

RegularInvoicePdf.propTypes = {
  invoice: PropTypes.object
};

export default RegularInvoicePdf;