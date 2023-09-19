import PropTypes from 'prop-types';

import { format } from 'date-fns'

// material-ui
import {
  Divider,
  Grid,
  Typography,
} from '@mui/material';

import MainCard from 'components/MainCard';

// assets
import { useNavigate } from 'react-router-dom';


// ==============================|| BILLINGINFO - CARD ||============================== //

const BillingInfoCard = ({ billingInfo }) => {

  const navigate = useNavigate();

  const handleClickDetails = () => {
    navigate('/billinginfo/' + billingInfo.id);
  };

  return (
    <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
      <Grid id="print" container spacing={2.25}>
        <Grid item xs={12}>
          <Typography onClick={handleClickDetails} className="clickable" variant="h5">
            {billingInfo.itemName}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={4}>
          <Typography color="secondary">
            Talent
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" color="secondary">
            {billingInfo.contractorName}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" color="secondary">
            Company
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" color="secondary">
            {billingInfo.employerName}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" color="secondary">
            Start Date
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" color="secondary">
            {format(new Date(billingInfo.startDate), "yyyy-MM-dd")}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" color="secondary">
            End Date
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" color="secondary">
            {format(new Date(billingInfo.startDate), "yyyy-MM-dd")}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" color="secondary">
            Status
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" color="secondary">
            {billingInfo.billingStatus}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" color="secondary">
            Creation Date
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" color="secondary">
            {format(new Date(billingInfo.createdAtUtc), "yyyy-MM-dd")}
          </Typography>
        </Grid>
      </Grid>
    </MainCard>
  )
};

BillingInfoCard.propTypes = {
  billingInfo: PropTypes.object
};

export default BillingInfoCard;