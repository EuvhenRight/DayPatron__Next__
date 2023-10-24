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
        <Grid item xs={4}>
          <Typography color="secondary">
            Talent
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" color="secondary">
            {billingInfo.contractorLegalEntityName} ({billingInfo.contractorFullName})
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body1" color="secondary">
            Company
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body1" color="secondary">
            {billingInfo.employerLegalEntityName}
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
            {format(new Date(billingInfo.endDate), "yyyy-MM-dd")}
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
            {format(new Date(billingInfo.createdAtUtc), "yyyy-MM-dd HH:mm:ss")}
          </Typography>
        </Grid>
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