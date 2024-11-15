import React from 'react';
import { useSelector } from 'react-redux';
import {
  useChannelStateContext,
  useChatContext
} from 'stream-chat-react';
import {  MenuOutlined, UsergroupAddOutlined } from '@ant-design/icons';

import IconButton from 'components/@extended/IconButton';
import { 
  Avatar, 
  AvatarGroup, 
  Stack, 
  Typography,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import './TeamChannelHeader.css';

export const TeamChannelHeader = ({ setIsEditing, onShowChannelSelector, isChannelSelectorVisible, showSingleChannel }) => {
  const personalInformation = useSelector(state => state.personalInformation);
  const { channel } = useChannelStateContext();
  const { client } = useChatContext();
  const theme = useTheme();

  const allMembers = Object.values(channel.state.members);
  const otherMembers = allMembers.filter(({ user }) => user.id !== client.userID);
  const otherMembersNoAdmin = otherMembers.filter(({ user }) => user.id !== personalInformation.messagingProviderAdminUserId);
  const adminMembers = otherMembers.filter(({ user }) => user.id === personalInformation.messagingProviderAdminUserId);
  const otherMembersSorted = otherMembersNoAdmin.concat(adminMembers);

  const handleMembersClick = () => {
    setIsEditing(true);
  };
 
  const getChannelTitle = () => {
    let members = otherMembersSorted;

    if(allMembers.length === 1)
      members = allMembers;

    let titleText = members?.map(x => 
      {
        let result = x?.user?.name || x?.user?.id;
        if(x.user.id === client.userID)
          result += ' (Me)';
        return result;
      }
    ).join(', ');

    return <>
      <AvatarGroup max={3} spacing={6}>
        {members.map((member, memberIndex) => 
          <Avatar
            key={memberIndex}
            src={member?.user?.image}
            alt={member?.user?.name || member?.user?.id}
            sx={{ bgcolor: theme.palette.primary.main, width: '26px', height: '26px' }}
          >
            {member?.user?.name?.[0]}
          </Avatar>
        )}
      </AvatarGroup>
      <Typography sx={{textWrap: 'nowrap', fontWeight: 'bold', marginLeft: '5px !important', overflowX: 'hidden', textOverflow: 'ellipsis'}}>
        {titleText}
      </Typography>
    </>;
  };

  return (
    <>
      <Stack direction="row" justifyContent="space-between" sx={{ padding: "10px 20px 10px 20px" }} alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1} sx={{overflowX: 'hidden'}} className="channel-header-avatar-group">
          {!isChannelSelectorVisible && !showSingleChannel &&
            <IconButton sx={{ width: 22, height: 22 }}
              onClick={() => {onShowChannelSelector();}} 
              size="large" 
              className="tenx-messaging-channels-menu-button">
              <MenuOutlined />
            </IconButton>
          }
          
          {getChannelTitle()}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton edge="end" aria-label="comments" color="secondary" onClick={handleMembersClick}>
            <UsergroupAddOutlined style={{ fontSize: '1.15rem' }} />
            <Typography>
              {allMembers?.length}
            </Typography>
          </IconButton>
        </Stack>
      </Stack>
      <Divider />
    </>
  );
};
