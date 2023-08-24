import PropTypes from 'prop-types';

import {
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';

import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

import { useNavigate } from 'react-router-dom';

// ==============================|| ORDER - CARD ||============================== //

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const avatarImage = require.context('assets/images/orders', true);

  const handleClickDetails = () => {
    navigate('/orders/' + order.id);
  };

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <Avatar onClick={handleClickDetails} className="clickable" alt={order?.productTitle} src={avatarImage(`./default.png`)} />
                </ListItemAvatar>
                <ListItemText className="list-card-title"
                  primary={<Typography onClick={handleClickDetails} variant="subtitle1">{order?.productTitle}</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      {order?.contractorName}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          justifyContent="space-between"
          sx={{ mt: 'auto', mb: 0, pt: 2.25 }}
        >
          <Button variant="outlined" size="small" onClick={handleClickDetails} className="card-button-right">
            Details
          </Button>
        </Stack>
      </MainCard>
    </>
  );
};

OrderCard.propTypes = {
  order: PropTypes.object
};

export default OrderCard;
