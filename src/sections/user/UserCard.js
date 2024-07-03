import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// material-ui
import {
  Divider,
  Grid,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Chip
} from '@mui/material';

import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import { openSnackbar } from 'store/reducers/snackbar';

// assets
import { MailOutlined, UserDeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import {prepareApiBody, getNoQuotesString } from 'utils/stringUtils';
import { useKeycloak } from '@react-keycloak/web';
import { useDispatch } from 'react-redux';

const avatarImage = require.context('assets/images/users', true);

const UserCard = ({ user, bindUsers }) => {
  const { keycloak } = useKeycloak();
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));
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

  const handleArchiveUserEmployerLink = async (employerUserId, employerId, archivedOn) => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/employer-user-link-archivations',
        {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          },
          body: prepareApiBody({employerUserId, employerId, archivedOnUtc: archivedOn})
        }
      );

      if (!response.ok) {
        var responseMessage = getNoQuotesString(await response.text());
        dispatch(
          openSnackbar({
            open: true,
            message: responseMessage ?? 'Failed.',
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
          message: 'Updated.',
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
              >
                <ListItemAvatar>
                  <Avatar
                    className="clickable"
                    alt={getUserTitle(user)}
                    src={avatar}
                  />
                </ListItemAvatar>
                <ListItemText className="list-card-title"
                  primary={<Typography variant="subtitle1">{getUserTitle(user)}</Typography>}
                />
              </ListItem>
            </List>
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
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography color="secondary">
                        {employer?.roles?.map((role, roleIndex) => {return role + (roleIndex + 1 === employer.roles.length ? '' : ', ')})}
                      </Typography>
                      <Typography>
                        @
                      </Typography>
                      <Typography>
                        {employer?.employerName}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={0.5}>
                      {employer?.archivedOnUtc ?
                        (
                          <>
                            <Chip color="error" size="small" label="Archived" />
                            <IconButton onClick={() => { handleArchiveUserEmployerLink(user?.id, employer?.employerId, null); }} size="medium" color="success">
                              <UserAddOutlined />
                            </IconButton>
                          </>
                        )
                        : 
                        (
                          <>
                            <Chip color={employer?.userStatus === 'Confirmed' ? 'success' : 'primary'} size="small" label={employer?.userStatus} />
                            <IconButton onClick={() => { handleArchiveUserEmployerLink(user?.id, employer?.employerId, new Date()); }} size="medium" color="error">
                              <UserDeleteOutlined />
                            </IconButton>
                          </>
                        )
                      }
                    </Stack>
                  </Stack>
                ))}
                  
              </Grid>

            </Grid>
          </Grid>
          
        </Grid>
      </MainCard>
    </>
  );
};

UserCard.propTypes = {
  user: PropTypes.object
};

export default UserCard;
