import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
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
  Typography,
  Chip
} from '@mui/material';

import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { MailOutlined, MoreOutlined, UserDeleteOutlined } from '@ant-design/icons';
import {prepareApiBody } from 'utils/stringUtils';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';

const avatarImage = require.context('assets/images/users', true);

const UserCard = ({ user, bindUsers }) => {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));
  const openMenu = Boolean(anchorEl);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      var imgSrc = await getImageSrc(user?.mainImageUrl);
      setAvatar(imgSrc);

      if (imgSrc)
        setTimeout(function () {
            URL.revokeObjectURL(imgSrc);
        }, 1000);

    })();
  }, [user, keycloak?.idToken]);

  const handleClickDetails = () => {
    navigate('/users/' + user?.id);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

  const getUserTitle = (user) => {
    if(user?.firstName || user?.lastName)
      return user?.firstName + user?.lastName;

      return user?.email;
  }

  const handleArchiveUserEmployerLink = async (employerUserId, employerId) => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/employer-user-links',
        {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          },
          body: prepareApiBody({employerUserId, employerId})
        }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        return;
      }

      dispatch(
        openSnackbar({
          open: true,
          message: 'Archived.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

      await bindUsers();
    } catch (error) {
      console.error(error);
    }
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
                  <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
                    <MoreOutlined style={{ fontSize: '1.15rem' }} />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    onClick={handleClickDetails}
                    className="clickable"
                    alt={getUserTitle(user)}
                    src={avatar}
                  />
                </ListItemAvatar>
                <ListItemText className="list-card-title"
                  primary={<Typography onClick={handleClickDetails} variant="subtitle1">{getUserTitle(user)}</Typography>}
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
                  {user?.email &&
                    <ListItem>
                      <ListItemIcon>
                        <MailOutlined />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Link href={'mailto:' + user?.email} target="_blank" sx={{ textTransform: 'lowercase' }}>
                            {user?.email}
                          </Link>
                        }
                      />
                    </ListItem>}
                </List>
              </Grid>
              
              <Grid item xs={12}>
                {user?.employers.map((employer, employerIndex) => (
                  <Stack key={employerIndex} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography>
                        {employer?.employerName}
                      </Typography>
                      <Typography variant="caption" color="secondary">
                        (
                          {employer?.roles?.map((role, roleIndex) => {return role + (roleIndex + 1 === employer.roles.length ? '' : ', ')})}
                        )
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={0.5}>
                      {employer?.archivedOnUtc ?
                        (<Chip color="error" size="small" label="Archived" />)
                        : 
                        (<Chip color={employer?.userStatus === 'Confirmed' ? 'success' : 'primary'} size="small" label={employer?.userStatus} />)
                      }
                      <IconButton onClick={() => { handleArchiveUserEmployerLink(user?.id, employer?.employerId); }} size="medium" color="error">
                        <UserDeleteOutlined />
                      </IconButton>
                    </Stack>
                  </Stack>
                ))}
                  
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

UserCard.propTypes = {
  user: PropTypes.object
};

export default UserCard;
