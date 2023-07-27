import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
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
import industries from 'data/industries';
import countries from 'data/countries';

// ==============================|| EMPLOYER - CARD ||============================== //

const avatarImage = require.context('assets/images/companies', true);

const EmployerCard = ({ employer, alertEmployerToDelete }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(employer?.mainImageUrl);
      setAvatar(imgSrc);

      if (imgSrc)
        setTimeout(function () {
          URL.revokeObjectURL(imgSrc);
        }, 1000);

    })();
  }, [employer?.mainImageUrl]);

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
    navigate('/employers/' + employer.id);
  };

  const handleClickDelete = () => {
    alertEmployerToDelete(employer);
    setAnchorEl(null);
  };
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
                  <Avatar onClick={handleClickDetails} className="clickable" alt={employer.name} src={avatar} />
                </ListItemAvatar>
                <ListItemText className="list-card-title"
                  primary={<Typography onClick={handleClickDetails} variant="subtitle1">{employer.name}</Typography>}
                  secondary={
                    <Typography variant="caption" color="secondary">
                      {industries.find(item => item.code === employer.industry)?.label}
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
                </List>
                <List sx={{ p: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0.5 } }}>
                  {employer.country && 
                  <ListItem>
                    <ListItemIcon>
                      <EnvironmentOutlined />
                    </ListItemIcon>
                    <ListItemText primary={<Typography color="secondary">{countries.find(x => x.code === employer.country)?.label}</Typography>} />
                  </ListItem>}
                  {employer.linkedInUrl &&
                    <ListItem>
                      <ListItemIcon>
                        <LinkedinOutlined />
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
