import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import jobClusters from 'data/jobClusters';
// material-ui
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Typography,
  ListItem,
  Chip
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ItemPlaceholder from 'components/cards/skeleton/ItemPlaceholder';

const avatarImage = require.context('assets/images/subscription-offers', true);

// ==============================|| SUBSCRIPTION OFFER CARD ||============================== //

const SubscriptionOfferCard = ({ subscriptionOffer }) => {
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));
  const [isLoading, setLoading] = useState(true);
  const { keycloak } = useKeycloak();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(subscriptionOffer?.mainImageUrl);
      setAvatar(imgSrc);

      if (imgSrc)
        setTimeout(function () {
          URL.revokeObjectURL(imgSrc);
        }, 1000);

    })();
  }, [subscriptionOffer?.mainImageUrl, keycloak?.idToken]);

  const getImageSrc = async (imageUrl) => {
    try {
      if (!imageUrl) {
        return avatarImage(`./default.png`);
      }

      let response = await fetch(imageUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let imageBlob = await response.blob();

      return URL.createObjectURL(imageBlob);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {isLoading ? (
        <ItemPlaceholder />
      ) : (
        <MainCard
          content={false}
          boxShadow
          sx={{
            '&:hover': {
              transform: 'scale3d(1.02, 1.02, 1)',
              transition: 'all .4s ease-in-out'
            }
          }}
        >
          <Box sx={{ width: 250, m: 'auto', mt: '25px', mb: '25px' }}>
            <CardMedia
              sx={{ height: 250, textDecoration: 'none', opacity: 1 }}
              image={avatar}
              component={Link}
              to={`/subscriptions/${subscriptionOffer?.id}`}
            />
          </Box>
          <Divider />
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <Stack>
                  <Typography
                    component={Link}
                    to={`/subscriptions/${subscriptionOffer?.id}`}
                    color="textPrimary"
                    variant="h5"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      textDecoration: 'none'
                    }}
                  >
                    {subscriptionOffer?.summary}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: 0,
                    m: 0
                  }}
                  component="ul"
                >
                  {subscriptionOffer?.clusters?.map((cluster, clusterIndex) => (
                    <ListItem disablePadding key={clusterIndex} sx={{ width: 'auto', pr: 0.75, pb: 0.75 }}>
                      <Chip color="primary" variant="outlined" size="small" label={jobClusters.find(x => x.code === cluster)?.label} />
                    </ListItem>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center">

                  <Button variant="contained" onClick={() => {}}>
                    Details
                  </Button>

                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

SubscriptionOfferCard.propTypes = {
  subscriptionOffer: PropTypes.object
};

export default SubscriptionOfferCard;
