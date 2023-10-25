import PropTypes from 'prop-types';
import { format } from 'date-fns';

// material-ui
import {
  Divider,
  Grid,
  Stack,
  Typography,
  Button,
  Checkbox
} from '@mui/material';

import MainCard from 'components/MainCard';

// assets
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import countries from 'data/countries';


// ==============================|| BILLINGINFO - CARD ||============================== //

const BillingInfoCard = ({ billingInfo, toggleBillingInfoSelection, isSelected }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleClickDetails = (event) => {
    event.stopPropagation();
    navigate('/billinginfo/' + billingInfo.id);
  };

  if (!keycloak.tokenParsed.roles.includes('admin'))
    return <Typography>Unauthorized</Typography>

  return (
    <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
      <Grid id="print" container spacing={1.25}>
        <Grid item xs={12} onClick={() => {toggleBillingInfoSelection(billingInfo?.id)}}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={0.8}>
            <Typography onClick={handleClickDetails} className="clickable" variant="h5">
              {billingInfo.itemName}
            </Typography>
            <Checkbox checked={isSelected} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={2}>
              <Stack spacing={0.1}>
                <Typography color="secondary" variant="caption" className="small-field-header">
                  Talent
                </Typography>
                <Typography variant="body1" color="secondary">
                  {billingInfo.contractorLegalEntityName} ({billingInfo.contractorFullName})
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={0.1}>
                <Typography color="secondary" variant="caption" className="small-field-header">
                  Company
                </Typography>
                <Typography variant="body1" color="secondary">
                  {billingInfo.employerLegalEntityName}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={0.1}>
                <Typography color="secondary" variant="caption" className="small-field-header">
                  Start Date
                </Typography>
                <Typography variant="body1" color="secondary">
                  {format(new Date(billingInfo.startDate), "yyyy-MM-dd")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={0.1}>
                <Typography color="secondary" variant="caption" className="small-field-header">
                  End Date
                </Typography>
                <Typography variant="body1" color="secondary">
                  {format(new Date(billingInfo.endDate), "yyyy-MM-dd")}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={0.1}>
                <Typography color="secondary" variant="caption" className="small-field-header">
                  Status
                </Typography>
                <Typography variant="body1" color="secondary">
                  {billingInfo.billingStatus}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={2}>
              <Stack spacing={0.1}>
                <Typography color="secondary" variant="caption" className="small-field-header">
                  Creation Date
                </Typography>
                <Typography variant="body1" color="secondary">
                  {format(new Date(billingInfo.createdAtUtc), "yyyy-MM-dd HH:mm:ss")}
                </Typography>
              </Stack>
            </Grid>
          </Grid>  
        </Grid>
        {billingInfo?.invoices.map((invoice) => (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} key={invoice?.id}>
              <Grid container>

                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.invoiceType ? 'small-field-header' : 'small-field-header field-empty'}>
                      Type
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.invoiceType}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.invoiceNumber ? 'small-field-header' : 'small-field-header field-empty'}>
                      Invoice Number
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.invoiceNumber}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.status ? 'small-field-header' : 'small-field-header field-empty'}>
                      Status
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.status}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.invoiceDate ? 'small-field-header' : 'small-field-header field-empty'}>
                      Invoice Date
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.invoiceDate ? format(new Date(invoice?.invoiceDate), 'yyyy-MM-dd') : ''}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.dueDate ? 'small-field-header' : 'small-field-header field-empty'}>
                      Due Date
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.dueDate ? format(new Date(invoice?.dueDate), 'yyyy-MM-dd') : ''}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.purchaseOrderNumber ? 'small-field-header' : 'small-field-header field-empty'}>
                      Purchase Order #
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.purchaseOrderNumber}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.totalAmountExcludingVat ? 'small-field-header' : 'small-field-header field-empty'}>
                      Amount Excl. VAT
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.totalAmountExcludingVat}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.totalAmountIncludingVat ? 'small-field-header' : 'small-field-header field-empty'}>
                      Amount Incl. VAT
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.totalAmountIncludingVat}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.vatAmount ? 'small-field-header' : 'small-field-header field-empty'}>
                      VAT Amount
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.vatAmount}
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.invoiceItems?.[0]?.description ? 'small-field-header' : 'small-field-header field-empty'}>
                      Item Description
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.invoiceItems?.[0]?.description ? invoice?.invoiceItems?.[0]?.description?.substring(0, 20) + '...' : ''}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.invoiceItems?.[0]?.quantity || invoice?.invoiceItems?.[0]?.quantity === 0 ? 'small-field-header' : 'small-field-header field-empty'}>
                      Item Qty
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.invoiceItems?.[0]?.quantity}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.invoiceItems?.[0]?.unitPrice || invoice?.invoiceItems?.[0]?.unitPrice === 0 ? 'small-field-header' : 'small-field-header field-empty'}>
                      Item Unit Price
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.invoiceItems?.[0]?.unitPrice}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.invoiceItems?.[0]?.totalAmount || invoice?.invoiceItems?.[0]?.totalAmount === 0 ? 'small-field-header' : 'small-field-header field-empty'}>
                      Item Total Amount
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.invoiceItems?.[0]?.totalAmount}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.invoiceItems?.[0]?.rateType ? 'small-field-header' : 'small-field-header field-empty'}>
                      Item Rate Type
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.invoiceItems?.[0]?.rateType}
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.legalEntityName ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor Legal Name
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.legalEntityName}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.fullName ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor Name
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.fullName}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.address?.street ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor Street
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.address?.street}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.address?.streetNumber ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor Street #
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.address?.streetNumber}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.address?.city ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor City
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.address?.city}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.address?.postCode ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor Post Code
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.address?.postCode}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.address?.country ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor Country
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {countries.find(item => item.code === invoice?.creditor?.address?.country)?.label}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.vatNumber ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor VAT #
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.vatNumber}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.vatPercentage || invoice?.creditor?.vatPercentage === 0 ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor VAT %
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.vatPercentage}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.chamberOfCommerceIdentifier ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor CoC #
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.chamberOfCommerceIdentifier}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.creditor?.bankAccountNumber ? 'small-field-header' : 'small-field-header field-empty'}>
                      Creditor Bank Account #
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.creditor?.bankAccountNumber}
                    </Typography>
                  </Stack>
                </Grid>
                
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.legalEntityName ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor Legal Name
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.legalEntityName}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.fullName ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor Name
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.fullName}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.address?.street ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor Street
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.address?.street}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.address?.streetNumber ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor Street #
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.address?.streetNumber}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.address?.city ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor City
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.address?.city}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.address?.postCode ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor Post Code
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.address?.postCode}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.address?.country ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor Country
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {countries.find(item => item.code === invoice?.debtor?.address?.country)?.label}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.vatNumber ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor VAT #
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.vatNumber}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.vatPercentage || invoice?.debtor?.vatPercentage === 0 ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor VAT %
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.vatPercentage}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.chamberOfCommerceIdentifier ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor CoC #
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.chamberOfCommerceIdentifier}
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <Stack spacing={0.1}>
                    <Typography color="secondary" variant="caption" className={invoice?.debtor?.bankAccountNumber ? 'small-field-header' : 'small-field-header field-empty'}>
                      Debtor Bank Account #
                    </Typography>
                    <Typography variant="body1" color="secondary">
                      {invoice?.debtor?.bankAccountNumber}
                    </Typography>
                  </Stack>
                </Grid>

              </Grid>  
            </Grid>
          </>
        ))}

        <Grid item xs={12}>
          <Button variant="outlined" size="small" onClick={handleClickDetails} className="card-button-right">
            Details
          </Button>
        </Grid>
      </Grid>
    </MainCard>
  )
};

BillingInfoCard.propTypes = {
  billingInfo: PropTypes.object
};

export default BillingInfoCard;