import PropTypes from 'prop-types';
import { Page, View, Document, StyleSheet, Text, Image } from '@react-pdf/renderer';
import Html from 'react-pdf-html';
import Logo from 'assets/images/logo.png';

import countries from 'data/countries';

const textPrimary = '#262626';
const textTitle = '#EB5A21';
const border = '#f0f0f0';

const styles = StyleSheet.create({
  page: {
    padding: 30
  },
  pageText: {
    paddingRight: 30
  },
  card: {
    border: `1px solid ${border}`,
    padding: 18,
    flexDirection: 'column',
    width: '100%'
  },
  half: {
    width: '50%'
  },
  column: {
    flexDirection: 'column',
    gap: 16
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16
  },
  end: {
    alignItems: 'flex-end'
  },
  text: {
    fontSize: 12,
    lineHeight: 1.2,
    color: textPrimary
  },
  subTitle: {
    fontSize: 8,
    lineHeight: 1,
    color: textPrimary
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
  logo: {
    width: 75
  },
  hr: {
    borderBottom: `1px solid ${border}`,
    paddingTop: 18,
    paddingBottom: 18
  }
});

const MissionEmployerServiceOrderPdfCard = ({ order }) => {
  return (
    <Document title={`${order?.id}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.column}>


          <View style={styles.row}>
            <View style={styles.half}>
              <Image src={Logo} style={styles.logo} />
            </View>
            <View style={styles.half}>
              <View style={styles.end}>
                <Text style={styles.h1}>Service Order</Text>
              </View>
            </View>
          </View>
          <Text style={styles.text}>ID: {order?.employerServiceOrder?.id}</Text>

          <View style={styles.row}>
            <View style={styles.half}>
              <View style={styles.card}>
                <Text style={styles.text}>{order?.employerLegalEntityName}</Text>
                {order?.employerLegalEntityName !== order?.employerLegalEntityRepresentativeName &&
                  <Text style={styles.text}>{order?.employerLegalEntityRepresentativeName}</Text>
                }
                <Text style={styles.text}>{order?.employerStreet} {order?.employerStreetNumber}</Text>
                <Text style={styles.text}>{order?.employerPostCode} {order?.employerCity}</Text>
                <Text style={styles.text}>{countries.find(x => x.code === order?.employerCountry)?.label}</Text>
              </View>
            </View>
            <View style={styles.half}>
              <View style={styles.card}>
                <Text style={styles.text}>{order?.adminLegalEntityName}</Text>
                <Text style={styles.text}>{order?.adminLegalEntityRepresentativeName}</Text>
                <Text style={styles.text}>{order?.adminStreet} {order?.adminStreetNumber}</Text>
                <Text style={styles.text}>{order?.adminPostCode} {order?.adminCity}</Text>
                <Text style={styles.text}>{countries.find(x => x.code === order?.adminCountry)?.label}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.text}>10x-er:</Text>
              </View>
              <View style={styles.half}>
                <View style={styles.end}>
                  <Text style={styles.text}>{order?.contractorName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.text}>Mission:</Text>
              </View>
              <View style={styles.half}>
                <View style={styles.end}>
                  <Text style={styles.text}>{order?.itemTitle}</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.text}>Effort:</Text>
              </View>
              <View style={styles.half}>
                <View style={styles.end}>
                  <Text style={styles.text}>{order?.employerServiceOrder?.duration}</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.text}>Rate type:</Text>
              </View>
              <View style={styles.half}>
                <View style={styles.end}>
                  <Text style={styles.text}>{order?.employerServiceOrder?.rateType}</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.text}>Rate:</Text>
              </View>
              <View style={styles.half}>
                <View style={styles.end}>
                  <Text style={styles.text}>&euro;{order?.employerServiceOrder?.rateAmount}</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.text}>Total amount:</Text>
              </View>
              <View style={styles.half}>
                <View style={styles.end}>
                  <Text style={styles.text}>&euro;{order?.employerServiceOrder?.totalAmount}</Text>
                </View>
              </View>
            </View>

          </View>

          <Text style={styles.h2}>Purchase Terms</Text>

          <View style={styles.pageText}>
            <Html style={styles.text} stylesheet={{ ul: { margin: 0, padding: 0 } }}>{order?.employerServiceOrder?.description}</Html>
          </View>
          <Text style={styles.h2}> </Text>
          <Text style={styles.h2}> </Text>
          <View style={styles.hr}></View>
          <Text style={styles.h2}>10x Yourself. 10x Your Business.</Text>

          <Text style={styles.subTitle}>www.10x.team | hello@10x.team | NL50 BUNQ 2086 7050 69 | Tr.Reg. 89418344 | VAT NL864976835B01</Text>

        </View>
      </Page>
    </Document>
  );
};

MissionEmployerServiceOrderPdfCard.propTypes = {
  order: PropTypes.object
};

export default MissionEmployerServiceOrderPdfCard;
