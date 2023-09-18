import PropTypes from 'prop-types';

// import { format } from 'date-fns'

// material-ui
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
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
          <ListItemText className="list-card-title"
            primary={
              <Typography onClick={handleClickDetails} variant="h5">
                {billingInfo.itemName}
              </Typography>
            }
            secondary={
              <Typography variant="subtitle2" color="secondary">
                {billingInfo.startDate} - {billingInfo.endDate}
              </Typography>
            }
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <Grid container spacing={1}>
          <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 1, py: 1 } }}>
            {billingInfo.itemName &&
              <ListItem>
                <ListItemText
                  primary={
                    <Typography color="secondary">
                      Talent: {billingInfo.contractorName}
                    </Typography>
                  }
                  secondary={
                    <Typography color="secondary">
                      Company: {billingInfo.employerName}
                    </Typography>
                  }
                />
              </ListItem>
            }
          </List>
        </Grid>
      </Grid>
    </MainCard>

  )
};

BillingInfoCard.propTypes = {
  billingInfo: PropTypes.object
};

export default BillingInfoCard;