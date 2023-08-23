import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SanitizedHTML from 'react-sanitized-html';

// material-ui
import { Grid, CardMedia, Stack, Typography, Button } from '@mui/material';

// project imports
import MainCard from 'components/MainCard';
import { useKeycloak } from '@react-keycloak/web';
const avatarImage = require.context('assets/images/products', true);

// ==============================|| PRODUCT DETAILS - MAIN ||============================== //

const ProductDetails = () => {
  const { keycloak } = useKeycloak();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));

  const bindProduct = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/products/' + productId,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setProduct(json);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      if (productId) {
        await bindProduct();
      }
    })();
  }, [productId]);

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

  const handleBuyClick = () => {

  };

  return (
    <>
      {product && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <MainCard>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>

                  <CardMedia
                    image={avatar}
                    component="img"
                    sx={{ borderRadius: `4px`, position: 'relative' }}
                  />

                </Grid>
                <Grid item xs={12} sm={8}>

                  <Stack spacing={2}>
                    <Typography variant="h3">{product?.title}</Typography>
                    <SanitizedHTML html={product?.description} />
                    <Typography variant="h3">&euro;{product?.price}</Typography>
                    <Button onClick={handleBuyClick} fullWidth color="primary" variant="contained" size="large">
                      Buy Now
                    </Button>
                  </Stack>

                </Grid>
              </Grid>
            </MainCard>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ProductDetails;
