import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Link,
  Divider,
  Fade,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  Typography,
  Menu,
  MenuItem
} from '@mui/material';

import { pdf } from '@react-pdf/renderer';
import ProductEmployerServiceOrderPdfCard from 'sections/order/ProductEmployerServiceOrderPdfCard';
import ProductContractorServiceOrderPdfCard from 'sections/order/ProductContractorServiceOrderPdfCard';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import InfoWrapper from 'components/InfoWrapper';
import { MoreOutlined, ShoppingCartOutlined, DownloadOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { useKeycloak } from '@react-keycloak/web';

// ==============================|| ORDER - CARD ||============================== //

const ProductOrderCard = ({ order, handleApproveClick }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuEditClick = () => {
    navigate('/orders/solution/' + order.id);
  };

  const getStatusComponent = (approvalStatus, role, subOrderType) => {
    if (approvalStatus === 'Pending' && keycloak.tokenParsed.roles.includes(role)) {
      return <Stack direction="row" spacing={0.5}>
        <Typography>{approvalStatus}</Typography>
        <Stack direction="row">
          (<Link className="clickable" onClick={() => handleApproveClick(order, subOrderType, role)}>Approve</Link>)
        </Stack>
      </Stack>;
    }

    return <Typography>{approvalStatus}</Typography>;
  }

  const handleDownloadPdf = async (pdfDocument) => {
    const blob = await pdf((pdfDocument)).toBlob();
    var fileUrl = URL.createObjectURL(blob);
    window.open(fileUrl, '_blank');

    if (fileUrl)
      setTimeout(function () {
        URL.revokeObjectURL(fileUrl);
      }, 120000);
  }

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding
                secondaryAction={
                  keycloak.tokenParsed.roles.includes('admin') &&
                  <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
                    <MoreOutlined style={{ fontSize: '1.15rem' }} />
                  </IconButton>
                }>
                <ListItemAvatar>
                  <ShoppingCartOutlined style={{ color: theme.palette.primary.main, fontSize: '2.5rem' }} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">Buy &apos;{order?.productTitle}&apos;</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      Solution by &apos;{order?.contractorName}&apos;
                    </Typography>
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
              <MenuItem onClick={handleMenuEditClick}>Edit</MenuItem>
            </Menu>

          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="column" spacing={2}>
              <Stack direction="column" spacing={1}>

                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <InfoWrapper tooltipText="product_order_card_company_service_order_title_tooltip">
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Company Service Order
                    </Typography>
                  </InfoWrapper>

                  <IconButton sx={{ width: 22, height: 22, mr: 1.5 }} onClick={() => handleDownloadPdf(<ProductEmployerServiceOrderPdfCard order={order} />)}>
                    <DownloadOutlined />
                  </IconButton>
                  
                </Stack>
                
                <Divider />

                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="product_order_card_company_service_order_admin_approval_status_tooltip">
                        <Typography>
                          10x Team B.V. Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      {getStatusComponent(order?.employerServiceOrder?.adminStatus, 'admin', 'employer-service-order')}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="product_order_card_company_service_order_company_approval_status_tooltip">
                        <Typography>
                          Company Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      {getStatusComponent(order?.employerServiceOrder?.employerStatus, 'employer', 'employer-service-order')}
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="product_order_card_company_service_order_amount_tooltip">
                        <Typography>
                          Amount
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>&euro;{order?.employerServiceOrder?.rateAmount}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </Stack>

              <Stack direction="column" spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <InfoWrapper tooltipText="product_order_card_talent_service_order_title_tooltip">
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Talent Service Order1
                    </Typography>
                  </InfoWrapper>

                  {keycloak.tokenParsed.roles.includes('admin') &&
                    <IconButton sx={{ width: 22, height: 22, mr: 1.5 }} onClick={() => handleDownloadPdf(<ProductContractorServiceOrderPdfCard order={order} />)}>
                      <DownloadOutlined />
                    </IconButton>
                  }

                </Stack>
                <Divider />
                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="product_order_card_talent_service_order_admin_approval_status_tooltip">
                        <Typography>
                          10x Team B.V. Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      {getStatusComponent(order?.contractorServiceOrder?.adminStatus, 'admin', 'contractor-service-order')}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="product_order_card_talent_service_order_talent_approval_status_tooltip">
                        <Typography>
                          Talent Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>{order?.contractorServiceOrder?.contractorStatus}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>

                  {keycloak.tokenParsed.roles.includes('admin') &&
                    <ListItem>
                      <ListItemText>
                        <InfoWrapper tooltipText="product_order_card_talent_service_order_amount_tooltip">
                          <Typography>
                            Amount
                          </Typography>
                        </InfoWrapper>
                      </ListItemText>
                      <ListItemSecondaryAction>
                        <Typography>&euro;{order?.contractorServiceOrder?.rateAmount}</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  }
                </List>
              </Stack>

              <Stack direction="column" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  <InfoWrapper tooltipText="product_order_card_project_order_title_tooltip">
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Project Order
                    </Typography>
                  </InfoWrapper>
                </Typography>
                <Divider />
                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>

                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="product_order_card_project_order_company_approval_status_tooltip">
                        <Typography>
                          Company Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>{order?.employerContractorProjectOrder?.employerStatus}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="product_order_card_project_order_talent_approval_status_tooltip">
                        <Typography>
                          Talent Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>{order?.employerContractorProjectOrder?.contractorStatus}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>

                </List>
              </Stack>

            </Stack>
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

ProductOrderCard.propTypes = {
  order: PropTypes.object,
  handleApproveClick: PropTypes.func
};

export default ProductOrderCard;
