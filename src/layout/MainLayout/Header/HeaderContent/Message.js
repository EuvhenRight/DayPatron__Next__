import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, ClickAwayListener, List, ListItemButton, Paper, Popper, useMediaQuery } from '@mui/material';
// project import
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import Transitions from 'components/@extended/Transitions';

// assets
import { MailOutlined } from '@ant-design/icons';

// sx styles
const avatarSX = {
  width: 48,
  height: 48
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

// ==============================|| HEADER CONTENT - MESSAGES ||============================== //

const Message = () => {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

  useEffect(() => {
    try {
      let response = fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/messages', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + keycloak.idToken
        }
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : iconBackColor }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <MailOutlined />
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [matchesXs ? -60 : 0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: '100%',
                minWidth: 285,
                maxWidth: 420,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 285
                }
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard title="Messages" elevation={0} border={false} content={false}>
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 1.5,
                        '& .MuiAvatar-root': avatarSX,
                        '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                      }
                    }}
                  >
                    <ListItemButton sx={{ textAlign: 'center' }}>No message</ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Message;
