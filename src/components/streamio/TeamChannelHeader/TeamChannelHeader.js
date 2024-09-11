import React, { useState } from 'react';
import {
  Avatar,
  useChannelActionContext,
  useChannelStateContext,
  //useChatContext
} from 'stream-chat-react';
import { MoreOutlined, MenuOutlined } from '@ant-design/icons';

import IconButton from 'components/@extended/IconButton';
import { 
  Stack, 
  Typography,
  Menu,
  MenuItem,
  Fade, 
  Divider
} from '@mui/material';

import './TeamChannelHeader.css';

export const TeamChannelHeader = ({ setIsEditing, setPinsOpen, onShowChannelSelector, isChannelSelectorVisible }) => {
  const { closeThread } = useChannelActionContext();
  const { channel } = useChannelStateContext();
  //const { client } = useChatContext();
  const members = Object.values(channel.state.members);
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
      <Stack direction="row" justifyContent="space-between" sx={{ padding: "10px 20px 10px 20px" }} alignItems="center">
        <Stack direction="row" alignItems="center">
          {!isChannelSelectorVisible && 
            <IconButton sx={{ width: 22, height: 22, mr: 1.5 }}
              onClick={() => {onShowChannelSelector();}} 
              size="large" 
              className="tenx-messaging-channels-menu-button">
              <MenuOutlined />
            </IconButton>
          }
          
          <Stack direction="row" spacing={2} alignItems="center">
            {members.map(({ user }, i) => {
              return (
                <Stack direction="row" key={i} spacing={1} alignItems="center">
                  <Avatar image={null} name={user?.name || user?.id} size={24} />
                  <Typography>
                    {user?.name || user?.id || '#'}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
        <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMenuClick}>
          <MoreOutlined style={{ fontSize: '1.15rem' }} />
        </IconButton>
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
          <MenuItem 
            onClick={() => 
              setIsEditing(true)
            }>
            Edit
          </MenuItem>
          <MenuItem 
            onClick={(e) => {
              closeThread(e);
              setPinsOpen((prevState) => !prevState);
            }}>
            Pins
          </MenuItem>
        </Menu>
      </Stack>
      <Divider />
    </>
  );
};
