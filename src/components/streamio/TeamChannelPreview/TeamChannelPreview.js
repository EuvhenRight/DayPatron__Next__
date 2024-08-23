import React, {Fragment} from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { Divider, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { CheckOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns'

import './TeamChannelPreview.css';

export const TeamChannelPreview = (props) => {
  const theme = useTheme();
  const { channel, setActiveChannel, setIsCreating, setIsEditing, onChannelSelected } = props;

  const { channel: activeChannel, client } = useChatContext();

  const allMembers = Object.values(channel.state.members);

  const otherMembers = allMembers.filter(
    ({ user }) => user.id !== client.userID,
  );

  const defaultName = '#';
  
  const getAvatar = () => {
    if(channel?.data?.name) {
      return <Avatar
        image={undefined}
        name={channel?.data?.name}
        size={36}
      />;
    }

    if(otherMembers?.length === 1) {
      return <Avatar
        image={otherMembers[0]?.user.image || undefined}
        name={otherMembers[0]?.user.name || otherMembers[0]?.user.id}
        size={36}
      />;
    }

    return <Avatar
      image={undefined}
      name={undefined}
      size={36}
    />;
  };
  

  const getUserLabel = (user) => {
    let result = (user.name || user.id) + ' (' + userTypes.find(item => item.code === user.tenxUserType)?.label + ')';
    return result;
  };

  const getChannelName = () => {
    if(channel?.data?.name) {
      return <>
        {channel?.data?.name}
      </>;
    }

    if(otherMembers?.length === 1) {
      return <>{getUserLabel(otherMembers[0]?.user)}</>;
    }

    if(allMembers?.length === 1 && allMembers[0]?.user.id === client.userID) {
      return <>{getUserLabel(allMembers[0]?.user)} (Me)</>;
    }

    if(otherMembers?.length > 1) {
      return <>
        {getUserLabel(otherMembers[0]?.user)},{' '}
        {getUserLabel(otherMembers[1]?.user)}
      </>;
    }

    return <>{defaultName}</>;
  };
  
  return (
    <Fragment>
      <ListItemButton
        sx={{ pl: 1 }}
        onClick={() => {
          onChannelSelected();
          setIsCreating(false);
          setIsEditing(false);
          setActiveChannel(channel);
        }}
        selected={channel?.id === activeChannel?.id}
      >
        <ListItemAvatar>
          {getAvatar()}
        </ListItemAvatar>
        <ListItemText
          primary={
            <Stack component="span" direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography
                variant="h5"
                color="inherit"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {getChannelName()}
              </Typography>
              {channel?.state?.last_message_at && 
                <Typography component="span" color="textSecondary" variant="caption">
                  {format(channel.state.last_message_at, 'yyyy-MM-dd hh:mm')}
                </Typography>
              }
            </Stack>
          }
          secondary={
            <Stack component="span" direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {channel.state.messages?.[-1]}
              </Typography>
              {channel.countUnread() ? (
                <Dot color="primary" />
              ) : (
                <CheckOutlined style={{ color: theme.palette.primary.main }} />
              )}
            </Stack>
          }
        />
      </ListItemButton>
      <Divider />
    </Fragment>
  );
};
