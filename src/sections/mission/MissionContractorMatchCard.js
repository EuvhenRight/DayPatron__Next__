import PropTypes from 'prop-types';
import { useState } from 'react';
// material-ui
import {
  Button,
  Divider,
  Fade,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';

import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';

// assets
import { EnvironmentOutlined, LinkedinOutlined, MailOutlined, MoreOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import countries from 'data/countries';

// ==============================|| MISSION CONTRACTOR MATCH - CARD ||============================== //

const avatarImage = require.context('assets/images/users', true);

const MissionContractorMatchCard = ({ missionContractorMatch, missionId }) => {
  const navigate = useNavigate();

  const handleClickDetails = () => {
    navigate('/missions/' + missionId + '/matches/' + missionContractorMatch?.contractor?.id);
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
      <MainCard sx={{ height: 1, '& .MuiCardContent-root': { height: 1, display: 'flex', flexDirection: 'column' } }}>
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
                  <Avatar onClick={handleClickDetails} className="clickable" alt={missionContractorMatch?.contractor?.firstName + ' ' + missionContractorMatch?.contractor?.lastName} src={missionContractorMatch?.contractor?.mainImageUrl ? missionContractorMatch.contractor.mainImageUrl : avatarImage('./default.png')} />
                </ListItemAvatar>
                <ListItemText className="list-card-title"
                  primary={<Typography onClick={handleClickDetails} variant="subtitle1">{missionContractorMatch?.contractor?.firstName + ' ' + missionContractorMatch?.contractor?.lastName}</Typography>}
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
              <MenuItem onClick={handleClickDetails}>Details</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                  {missionContractorMatch?.contractor?.email &&
                    <ListItem>
                      <ListItemIcon>
                        <MailOutlined />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link href={'mailto:' + missionContractorMatch?.contractor?.email} target="_blank" sx={{ textTransform: 'lowercase' }}>
                            {missionContractorMatch?.contractor?.email}
                          </Link>
                        }
                      />
                    </ListItem>}
                </List>
                <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                  {missionContractorMatch?.contractor?.country && 
                  <ListItem>
                    <ListItemIcon>
                      <EnvironmentOutlined />
                    </ListItemIcon>
                    <ListItemText primary={<Typography color="secondary">{countries.find(x => x.code === missionContractorMatch?.contractor?.country)?.label}</Typography>} />
                  </ListItem>}
                  {missionContractorMatch?.contractor?.linkedInUrl &&
                    <ListItem>
                      <ListItemIcon>
                        <LinkedinOutlined />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link href={missionContractorMatch?.contractor?.linkedInUrl} target="_blank" sx={{ textTransform: 'lowercase' }}>
                            {missionContractorMatch?.contractor?.linkedInUrl}
                          </Link>
                        }
                      />
                    </ListItem>}
                </List>
              </Grid>
            </Grid>
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

MissionContractorMatchCard.propTypes = {
  missionContractorMatch: PropTypes.object,
  missionId: PropTypes.string
};

export default MissionContractorMatchCard;
