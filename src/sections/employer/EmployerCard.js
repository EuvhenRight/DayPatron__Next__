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
import { EnvironmentOutlined, LinkOutlined, MailOutlined, MoreOutlined, ShopOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import industries from 'data/industries';
import countries from 'data/countries';

// ==============================|| EMPLOYER - CARD ||============================== //

const EmployerCard = ({ employer, alertEmployerToDelete }) => {
  const navigate = useNavigate();

  const handleClickDetails = () => {
    navigate('/employers/' + employer.id);
  };

  const handleClickDelete = () => {
    alertEmployerToDelete(employer);
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
                  <Avatar onClick={handleClickDetails} className="clickable" alt={employer.name} src={employer.logoImageUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography onClick={handleClickDetails} className="clickable left" variant="subtitle1">{employer.name}</Typography>}
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
              <MenuItem onClick={handleClickDelete}>Archive</MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                  {employer.email &&
                    <ListItem>
                      <ListItemIcon>
                        <MailOutlined />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link href={'mailto:' + employer.email} target="_blank" sx={{ textTransform: 'lowercase' }}>
                            {employer.email}
                          </Link>
                        }
                      />
                    </ListItem>}
                  {employer.industry &&
                    <ListItem>
                      <ListItemIcon>
                        <ShopOutlined />
                      </ListItemIcon>
                      <ListItemText primary={<Typography color="secondary">{industries.find(item => item.code === employer.industry)?.label}</Typography>} />
                    </ListItem>}
                </List>
                <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                  {employer.country && <ListItem>
                    <ListItemIcon>
                      <EnvironmentOutlined />
                    </ListItemIcon>
                    <ListItemText primary={<Typography color="secondary">{countries.find(x => x.code === employer.country)?.label}</Typography>} />
                  </ListItem>}
                  {employer.linkedInUrl &&
                    <ListItem>
                      <ListItemIcon>
                        <LinkOutlined />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link href={employer.linkedInUrl} target="_blank" sx={{ textTransform: 'lowercase' }}>
                            {employer.linkedInUrl}
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

EmployerCard.propTypes = {
  employer: PropTypes.object
};

export default EmployerCard;
