import PropTypes from 'prop-types';
import { Page, View, Document, StyleSheet, Image, Text } from '@react-pdf/renderer';
import Logo from 'assets/images/logo.png';
import countries from 'data/countries';


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
  },
  subTitle: {
    fontSize: 8,
    lineHeight: 1,
    color: textPrimary
  },
});

const InvoicePdfCard = ({ invoice }) => {
  return (
    <Document title={`${invoice?.invoiceNumber}`}>
      <Page size="A4" style={styles.page}>

        <View style={styles.column}>

          <View style={styles.row}>
            <View style={styles.half}>
              <Image src={Logo} style={styles.logo} />
            </View>

            <View style={styles.end}>
              <Text style={styles.text}>10x Team B.V.</Text>
              <Text style={styles.text}>Oudeschans 72A</Text>
              <Text style={styles.text}>1011LE Amsterdam</Text>
              <Text style={styles.text}>Netherlands</Text>
              <Text style={styles.text}>KVK: 89418344</Text>
              <Text style={styles.text}>VAT Number: NL864976835B01</Text>
              <Text style={styles.text}>IBAN: NL50 BUNQ 2086 7050 69</Text>
            </View>

          </View>
        </View>

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

        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.h1}>Invoice </Text>
            <Text style={styles.text}>Invoice number: {invoice?.invoiceNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}> </Text>
            <Text style={styles.text}>Invoice date: {invoice?.invoiceDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}> </Text>
            <Text style={styles.text}>Due date: {invoice?.dueDate}</Text>
          </View>
        </View>


        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>
        <Text style={styles.text}> </Text>




        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.text}>{invoice?.invoiceItem?.quantity}</Text>
            <Text style={styles.text}>{invoice?.invoiceItem?.description}</Text>
            <Text style={styles.text}>{invoice?.invoiceItem?.unitPrice}</Text>
            <Text style={styles.text}>{invoice?.invoiceItem?.totalPrice}</Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.text}> </Text>
            <Text style={styles.text}>Subtotal</Text>
            <Text style={styles.text}>{invoice?.totalAmountExcludingVat}</Text>
            <Text style={styles.text}> </Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.row}>
            <Text style={styles.text}> </Text>
            <Text style={styles.text}>VAT</Text>
            <Text style={styles.text}>{invoice?.vatAmount}</Text>
            <Text style={styles.text}> </Text>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.row}>

            <Text style={styles.text}> </Text>
            <Text style={styles.text}>Total</Text>
            <Text style={styles.text}>{invoice?.totalAmountIncludingVat}</Text>
            <Text style={styles.text}> </Text>
          </View>
        </View>

        <Text style={styles.h2}> </Text>
        <Text style={styles.h2}> </Text>
        <View style={styles.hr}></View>
        <Text style={styles.h2}>10x Yourself. 10x Your Business.</Text>

        <Text style={styles.subTitle}>www.10x.team | hello@10x.team | NL50 BUNQ 2086 7050 69 | Tr.Reg. 89418344 | VAT NL864976835B01</Text>

      </Page>
    </Document>
  );
};

InvoicePdfCard.propTypes = {
  invoice: PropTypes.object
};

export default InvoicePdfCard;