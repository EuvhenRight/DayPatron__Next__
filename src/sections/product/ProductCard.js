import PropTypes from 'prop-types';
import { useKeycloak } from '@react-keycloak/web';
import { useState, useEffect } from 'react';
// material-ui
import {
  Button,
  Divider,
  Fade,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  ListItemIcon
} from '@mui/material';

// third-party
import { PDFDownloadLink } from '@react-pdf/renderer';
import SanitizedHTML from 'react-sanitized-html';

// project import
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import ProductPdfCard from 'sections/product/ProductPdfCard';

// assets
import { MoreOutlined, FieldTimeOutlined, EuroOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import jobClusters from 'data/jobClusters';

// ==============================|| PRODUCT - CARD ||============================== //

const avatarImage = require.context('assets/images/products', true);

const ProductCard = ({ product }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));

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

  const handleClickDetails = () => {
    navigate('/products/' + product.id);
  };

  const handleClickExportPdf = () => {
    setAnchorEl(null);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <MainCard  sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
                    <MoreOutlined style={{ fontSize: '1.15rem' }} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar onClick={handleClickDetails} className="clickable" alt={product.title} src={avatar} />
                </ListItemAvatar>
                <ListItemText className="list-card-title"
                  primary={<Typography onClick={handleClickDetails} variant="subtitle1">{product.title}</Typography>}
                  secondary={
                    <>
                      <Typography variant="caption" color="secondary">
                        {jobClusters.find(x => x.code === product.jobCluster)?.label}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </List>
            <Menu
              id="fade-menu"
              MenuListProps={{
                'aria-labelledby': 'fade-button'
              }}
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              TransitionComponent={Fade}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem sx={{ a: { textDecoration: 'none', color: 'inherit' } }}>
                <>
                  {' '}
                  <PDFDownloadLink onClick={handleClickExportPdf} document={<ProductPdfCard product={product} />} fileName={`product-${product.title}.pdf`}>
                    Export PDF
                  </PDFDownloadLink>
                </>
              </MenuItem>
              <MenuItem onClick={handleClickDetails}>Details</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <div className="card-description-container">
              <SanitizedHTML html={product?.description} />
            </div>
          </Grid>

          <Grid item xs={6}>
            <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
              {product.estimatedImplementationHours &&
                <ListItem>
                  <ListItemIcon>
                    <FieldTimeOutlined />
                  </ListItemIcon>
                  <ListItemText primary={<Typography color="secondary">{product.estimatedImplementationHours} hour(s)</Typography>} />
                </ListItem>}
            </List>
          </Grid>

          <Grid item xs={6}>
            <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
              {product.price &&
                <ListItem>
                  <ListItemIcon>
                    <EuroOutlined />
                  </ListItemIcon>
                  <ListItemText primary={<Typography color="secondary">{product.price}</Typography>} />
                </ListItem>}
            </List>
          </Grid>

        </Grid>
        <Stack
          direction="row"
          className="hideforPDf"
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

ProductCard.propTypes = {
  product: PropTypes.object
};

export default ProductCard;
