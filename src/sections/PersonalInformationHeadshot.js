import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { openSnackbar } from 'store/reducers/snackbar';
import { useKeycloak } from '@react-keycloak/web';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, FormLabel, Grid, TextField, Menu, MenuItem, Stack, Typography, Link as MuiLink, Button  } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Avatar from 'components/@extended/Avatar';
import { linkedInColor } from 'config';
import { PERSONAL_INFORMATION_UPDATE } from 'store/reducers/actions';

// assets
import { LinkedinFilled, MoreOutlined, CameraOutlined } from '@ant-design/icons';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| HEADSHOT ||============================== //

const EmployerHeadshot = ({ focusInput }) => {
  const { keycloak } = useKeycloak();
  const state = useSelector(state => state.personalInformation);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [uploading, setUploading] = useState(false);
  const [newMainImage, setNewMainImage] = useState(undefined);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMainImageUrlChange = async (newMainImageUrl) => {
    try {
      if (!newMainImageUrl) {
        setAvatar(avatarImage(`./default.png`));
        return;
      }

      let response = await fetch(newMainImageUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let imageBlob = await response.blob();
      var avatarSrc = URL.createObjectURL(imageBlob);
      setAvatar(avatarSrc);

      if (avatarSrc)
        setTimeout(function () {
          URL.revokeObjectURL(avatarSrc);
        }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleMainImageUrlChange(state.mainImageUrl);
  }, [state.mainImageUrl, keycloak?.idToken]);

  const handleChangeMainImage = (event) => {
    var newImage = event.target.files?.[0];
    if (newImage) {
      setNewMainImage(newImage);
      var avatarSrc = URL.createObjectURL(newImage);
      setAvatar(avatarSrc);

      if (avatarSrc)
        setTimeout(function () {
          URL.revokeObjectURL(avatarSrc);
        }, 1000);
    }
  };

  const handleUploadClick = async () => {

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("mainImage", newMainImage);

      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/users/' + encodeURIComponent(state.id) + '/main-images',
        {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          },
          body: formData
        }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Upload failed.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );

        return;
      }

      let json = await response.json();
      var newState = { ...state };
      newState.mainImageUrl = json.mainImageUrl;

      dispatch({ type: PERSONAL_INFORMATION_UPDATE, payload: newState });

      dispatch(
        openSnackbar({
          open: true,
          message: 'Image uploaded.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Upload failed.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      console.log(err);
    }

    setUploading(false);
    setNewMainImage(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  return (
    <MainCard>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="flex-end">
            <IconButton
              variant="light"
              color="secondary"
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreOutlined />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button'
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <MenuItem
                component={Link}
                to="/personal-information"
                onClick={() => {
                  handleClose();
                  setTimeout(() => {
                    focusInput();
                  });
                }}
              >
                Edit
              </MenuItem>
              <MenuItem onClick={handleClose} disabled>
                Delete
              </MenuItem>
            </Menu>
          </Stack>
          <Stack spacing={2.5} alignItems="center">
            <FormLabel
              htmlFor="change-avtar"
              sx={{
                position: 'relative',
                borderRadius: '50%',
                overflow: 'hidden',
                '&:hover .MuiBox-root': { opacity: 1 },
                cursor: 'pointer'
              }}
            >
              <Avatar alt="Avatar 1" src={avatar} sx={{ width: 124, height: 124, border: '1px dashed' }} />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .75)' : 'rgba(0,0,0,.65)',
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Stack spacing={0.5} alignItems="center">
                  <CameraOutlined style={{ color: theme.palette.secondary.lighter, fontSize: '2rem' }} />
                  <Typography sx={{ color: 'secondary.lighter' }}>Upload</Typography>
                </Stack>
              </Box>
            </FormLabel>
            <TextField
              type="file"
              id="change-avtar"
              placeholder="Outlined"
              variant="outlined"
              sx={{ display: 'none' }}
              onChange={handleChangeMainImage}
            />

            {newMainImage &&
              <Stack alignItems="center" spacing={2}>
                <Button onClick={handleUploadClick} variant="contained" disabled={uploading}>
                  {!uploading && <>Upload</>}
                  {uploading && <>Uploading...</>}
                </Button>
              </Stack>
            }

            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">{ state.firstName } { state.lastName }</Typography>
              <Typography color="secondary">
                <MuiLink href={`mailto:${state.email}`} target="_blank" rel="noreferrer">{state.email}</MuiLink>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={3} sx={{ '& svg': { fontSize: '1.15rem', cursor: 'pointer' } }}>
              <a href={state.linkedInUrl} target="_blank" rel="noreferrer"><LinkedinFilled style={{ color: linkedInColor }} /></a>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

EmployerHeadshot.propTypes = {
  focusInput: PropTypes.func
};

export default EmployerHeadshot;
