import React, {Fragment} from 'react';
import { useSelector } from 'react-redux';
import { useChatContext } from 'stream-chat-react';
import { Avatar, Divider, ListItemAvatar, ListItemButton, ListItemText, Stack, Typography } from '@mui/material';
import Dot from 'components/@extended/Dot';
import { CheckOutlined, TeamOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import * as dayjs from 'dayjs';
import dayJsRelativeTime from 'dayjs/plugin/relativeTime';

import './TeamChannelPreview.css';

dayjs.extend(dayJsRelativeTime);

export const TeamChannelPreview = (props) => {
  const theme = useTheme();
  const personalInformation = useSelector(state => state.personalInformation);
  const { channel, setActiveChannel, setIsCreating, setIsEditing, onChannelSelected } = props;

  const { channel: activeChannel, client } = useChatContext();

  const allMembers = Object.values(channel.state.members);
  const otherMembers = allMembers.filter(({ user }) => user.id !== client.userID);
  const otherMembersNoAdmin = otherMembers.filter(({ user }) => user.id !== personalInformation.messagingProviderAdminUserId);
  
  const getAvatarByMember = (member) => {
    return <Avatar
      src={member?.user?.image}
      alt={member?.user?.name || member?.user?.id}
      sx={{ bgcolor: theme.palette.primary.main }}
    >
      {member?.user?.name?.[0]}
    </Avatar>;
  }

  const getAvatar = () => {
    if(allMembers.length === 1) {
      return getAvatarByMember(allMembers[0]);
    } else if(otherMembers.length === 1) {
      return getAvatarByMember(otherMembers[0]);
    } else if(otherMembersNoAdmin.length === 1) {
      return getAvatarByMember(otherMembersNoAdmin[0]);
    } else if(otherMembersNoAdmin.length >= 1) {
      return <Avatar
        src={undefined}
        sx={{ bgcolor: theme.palette.primary.main }}
      >
        <TeamOutlined />
      </Avatar>;
    }
  };

  const getUserLabel = (user) => {
    let result = (user.name || user.id);
    return result;
  };

  const getChannelName = () => {
    if(allMembers.length === 1) {
      let result = getUserLabel(allMembers[0]?.user);
      if(allMembers[0]?.user.id === client.userID)
        result += " (Me)";
      return <>{result}</>;
    } else if(otherMembers.length === 1) {
      return <>{getUserLabel(otherMembers[0]?.user)}</>;
    } else if(otherMembersNoAdmin.length === 1) {
      return <>{getUserLabel(otherMembersNoAdmin[0]?.user)}</>;
    } else if(otherMembersNoAdmin.length >= 1) {
      return <>
        {otherMembersNoAdmin?.map(x => x?.user?.name || x?.user?.id).join(', ')}
      </>  
    }
  };
  
  return (
    <Fragment>
      <ListItemButton
        sx={{ pl: 1, pr: 1 }}
        onClick={() => {
          onChannelSelected();
          setIsCreating(false);
          setIsEditing(false);
          setActiveChannel(channel);
        }}
        selected={channel?.id === activeChannel?.id}
      >
        <ListItemAvatar sx={{width: '40px'}}>
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
                  whiteSpace: 'nowrap',
                  fontSize: '14px'
                }}
              >
                {getChannelName()}
              </Typography>
              {channel?.state?.last_message_at && 
                <Typography component="span" color="textSecondary" variant="caption" sx={{textWrap: 'nowrap'}}>
                  {dayjs(channel.state.last_message_at).fromNow(true)}
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
