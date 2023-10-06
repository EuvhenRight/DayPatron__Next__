import { StyleSheet, Text, View } from '@react-pdf/renderer';

const textPrimary = '#262626';
const border = '#f0f0f0';

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    lineHeight: 1.2,
    color: textPrimary
  },
  hr: {
    borderBottom: `1px solid ${border}`,
    paddingTop: 18,
    paddingBottom: 18
  },
})

const InvoiceFooterPdf = () => {

  return (
    <>
      <View style={styles.hr}></View>
      <Text style={styles.text}>10x Yourself. 10x Your Business.</Text>
      <Text style={styles.text}>www.10x.team</Text>
    </>
  )
}

export default InvoiceFooterPdf;