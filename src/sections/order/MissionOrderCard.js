import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Link,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  Typography
} from '@mui/material';

import { pdf } from '@react-pdf/renderer';
import MissionContractorServiceOrderPdfCard from 'sections/order/MissionContractorServiceOrderPdfCard';

import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import InfoWrapper from 'components/InfoWrapper';
import { ShoppingCartOutlined, DownloadOutlined, LinkOutlined, LoadingOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { useKeycloak } from '@react-keycloak/web';

// ==============================|| ORDER - CARD ||============================== //

const MissionOrderCard = ({ order, handleApproveClick }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const theme = useTheme();
  const [downloadingContractorServiceOrderId, setDownloadingContractorServiceOrderId] = useState(null);

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
  
  const handleProjectOrderTermsClick = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/orders/project-order-terms',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let file = await response.blob();
      var fileUrl = URL.createObjectURL(file);

      if (fileUrl)
        setTimeout(function () {
          URL.revokeObjectURL(fileUrl);
        }, 300000);

      window.open(fileUrl, '_blank');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
        <Grid id="print" container spacing={2.25}>
          <Grid item xs={12}>
            <List sx={{ width: 1, p: 0 }}>
              <ListItem
                disablePadding>
                <ListItemAvatar>
                  <ShoppingCartOutlined style={{ color: theme.palette.primary.main, fontSize: '2.5rem' }} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography variant="subtitle1">Mission &apos;{order?.itemTitle}&apos;</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      Company &apos;{order?.employerName}&apos;
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem disablePadding>
                <Stack direction="row" spacing={1}>
                  <Button variant="outlined"  onClick={() => { 
                    navigate('/messaging', { state: { targetEmployerId: order?.employerId} });
                  }}>
                    Message
                  </Button>
                </Stack>
              </ListItem>

            </List>

          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="column" spacing={2}>
              <Stack direction="column" spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <InfoWrapper tooltipText="mission_order_card_company_service_order_title_tooltip">
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Company Service Order
                    </Typography>
                  </InfoWrapper>

                </Stack>
                <Divider />

                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="mission_order_card_company_service_order_admin_approval_status_tooltip">
                        <Typography>
                          10x Team B.V. Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      {order?.employerServiceOrder?.adminStatus}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="mission_order_card_company_service_order_company_approval_status_tooltip">
                        <Typography>
                          Company Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      {order?.employerServiceOrder?.employerStatus}
                    </ListItemSecondaryAction>
                  </ListItem>

                </List>
              </Stack>

              <Stack direction="column" spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  
                  <InfoWrapper tooltipText="mission_order_card_talent_service_order_title_tooltip">
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Talent Service Order
                    </Typography>
                  </InfoWrapper>

                  {downloadingContractorServiceOrderId == order?.id ?
                      (
                        <Stack sx={{ mr: 2.2, mb: 0.5 }}>
                          <LoadingOutlined sx={{ width: 22, height: 22 }} />
                        </Stack>
                      )
                      :
                      (
                        <IconButton sx={{ width: 22, height: 22, mr: 1.5 }} onClick={async () => {
                          setDownloadingContractorServiceOrderId(order?.id);
                          await handleDownloadPdf(<MissionContractorServiceOrderPdfCard order={order} />);
                          setDownloadingContractorServiceOrderId(null);
                        }}>
                          <DownloadOutlined />
                        </IconButton>
                      )
                  }
                </Stack>
                <Divider />
                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>
                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="mission_order_card_talent_service_order_admin_approval_status_tooltip">
                        <Typography>
                          10x Team B.V. Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      {order?.contractorServiceOrder?.adminStatus}
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="mission_order_card_talent_service_order_talent_approval_status_tooltip">
                        <Typography>
                          Talent Approval Status
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      {getStatusComponent(order?.contractorServiceOrder?.contractorStatus, 'contractor', 'contractor-service-order')}
                    </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="mission_order_card_talent_service_order_amount_tooltip">
                        <Typography>
                          Amount
                        </Typography>
                      </InfoWrapper>
                    </ListItemText>
                    <ListItemSecondaryAction>
                      <Typography>&euro;{order?.contractorServiceOrder?.rateAmount}</Typography>
                    </ListItemSecondaryAction>
                  </ListItem>
                  
                </List>
              </Stack>

              <Stack direction="column" spacing={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <InfoWrapper tooltipText="mission_order_card_project_order_title_tooltip">
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Project Order
                    </Typography>
                  </InfoWrapper>

                  <IconButton sx={{ width: 22, height: 22, mr: 1.5 }} onClick={async () => {
                    await handleProjectOrderTermsClick();
                  }}>
                    <LinkOutlined />
                  </IconButton>
                </Stack>

                <Divider />
                <List component="nav" aria-label="main mailbox folders" sx={{ py: 0, '& .MuiListItem-root': { p: 0, py: 0 } }}>

                  <ListItem>
                    <ListItemText>
                      <InfoWrapper tooltipText="mission_order_card_project_order_company_approval_status_tooltip">
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
                      <InfoWrapper tooltipText="mission_order_card_project_order_talent_approval_status_tooltip">
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

MissionOrderCard.propTypes = {
  order: PropTypes.object,
  handleApproveClick: PropTypes.func
};

export default MissionOrderCard;
