import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Box, Divider, FormLabel, Grid, TextField, Menu, MenuItem, Stack, Typography, Link as MuiLink  } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Avatar from 'components/@extended/Avatar';
import { linkedInColor } from 'config';

// assets
import { LinkedinFilled, MoreOutlined, CameraOutlined } from '@ant-design/icons';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| USER PROFILE - TAB CONTENT ||============================== //

const ProfileHeadshot = ({ focusInput }) => {

  const state = useSelector(state => state.personalInformation);

  const theme = useTheme();
  const [newMainImage, setNewMainImage] = useState(undefined);
  const [avatar, setAvatar] = useState(avatarImage(`./default.png`));

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleChangeMainImage = (event) => {
    var newImage = event.target.files?.[0];
    if (newImage) {
      setNewMainImage(newImage);
      setAvatar(URL.createObjectURL(newImage));
    }
  };

  const handleUploadClick = () => {
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
                to="/profile/personal"
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
                <Button onClick={handleUploadClick} variant="contained">
                  Upload
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
        <Grid item sm={3} sx={{ display: { sm: 'block', md: 'none' } }} />
        <Grid item xs={12} sm={6} md={12}>
          <Stack direction="row" justifyContent="space-around" alignItems="center">
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">0</Typography>
              <Typography color="secondary">Pending</Typography>
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack spacing={0.5} alignItems="center">
              <Typography variant="h5">0</Typography>
              <Typography color="secondary">Completed</Typography>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

ProfileHeadshot.propTypes = {
  focusInput: PropTypes.func
};

export default ProfileHeadshot;
