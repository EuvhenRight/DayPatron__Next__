import PropTypes from 'prop-types';

// material-ui
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';

import MainCard from 'components/MainCard';

// ==============================|| BILLINGINFORMATION - CARD ||============================== //


const handleClickDetails = () => {

};

const BillingInformationCard = ({ billingInformation }) => {

  return (

    <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
      <Grid id="print" container spacing={2.25}>
        <Grid item xs={12}>
          <ListItemText className="list-card-title"
            primary={<Typography onClick={handleClickDetails} variant="subtitle1">{billingInformation.itemName}</Typography>}
            secondary={
              <Typography variant="caption" color="secondary">
                {billingInformation.id}
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
          <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
            {billingInformation.itemName &&
              <ListItem>
                <ListItemText
                  primary={<Typography color="secondary">{billingInformation.employerName}</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      {billingInformation.contractorName}
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

BillingInformationCard.propTypes = {
  billingInformation: PropTypes.object
};

export default BillingInformationCard;