import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import jobClusters from 'data/jobClusters';
// material-ui
import {
  Box,
  IconButton,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import SkeletonProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';
import { FieldTimeOutlined, DeleteFilled } from '@ant-design/icons';

const avatarImage = require.context('assets/images/products', true);

// ==============================|| PRODUCT CARD ||============================== //

const ProductCard = ({ product, alertProductToDelete }) => {
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));
  const [isLoading, setLoading] = useState(true);
  const { keycloak } = useKeycloak();

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(product?.mainImageUrl);
      setAvatar(imgSrc);

      if (imgSrc)
        setTimeout(function () {
          URL.revokeObjectURL(imgSrc);
        }, 1000);

    })();
  }, [product?.mainImageUrl]);

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

  const handleArchiveClick = () => {
    alertProductToDelete(product);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonProductPlaceholder />
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
              to={`/solutions/${product?.id}`}
            />
          </Box>
          <Divider />
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack>
                  <Typography
                    component={Link}
                    to={`/solutions/${product?.id}`}
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
                    {product?.title}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    {jobClusters.find(x => x.code === product.cluster)?.label}
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={6}>
                <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                  {product?.estimatedImplementationHours &&
                    <ListItem>
                      <ListItemIcon>
                        <FieldTimeOutlined />
                      </ListItemIcon>
                      <ListItemText primary={<Typography color="secondary">{product.estimatedImplementationHours} hour(s)</Typography>} />
                    </ListItem>}
                </List>
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5">&euro;{product?.contractorPrice}</Typography>
                  <IconButton onClick={handleArchiveClick} size="large" color="error">
                    <DeleteFilled />
                  </IconButton>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object
};

export default ProductCard;
