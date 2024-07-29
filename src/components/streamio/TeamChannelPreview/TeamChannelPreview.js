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
  const { channel, setActiveChannel, setIsCreating, setIsEditing } = props;

  const { channel: activeChannel, client } = useChatContext();

  const members = Object.values(channel.state.members).filter(
    ({ user }) => user.id !== client.userID,
  );
  const defaultName = '#';

  return (
    <Fragment>
      <ListItemButton
        sx={{ pl: 1 }}
        onClick={() => {
          setIsCreating(false);
          setIsEditing(false);
          setActiveChannel(channel);
        }}
        selected={channel?.id === activeChannel?.id}
      >
        <ListItemAvatar>
          {members?.length > 1 ? 
            (
              <>
                <Avatar
                  image={members[0]?.user.image || undefined}
                  name={members[0]?.user.name || members[0]?.user.id}
                  size={18}
                />
                <Avatar
                  image={members[1]?.user.image || undefined}
                  name={members[1]?.user.name || members[1]?.user.id}
                  size={18}
                />
              </>
            ) : 
            (
              <Avatar
                image={members[0]?.user.image || undefined}
                name={members[0]?.user.name || members[0]?.user.id}
                size={24}
              />
            )
          }
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
                {members?.length > 1 ? 
                  (
                    <>
                      {members[0]?.user.name || members[0]?.user.id || defaultName},{' '}
                      {members[1]?.user.name || members[1]?.user.id || defaultName}
                    </>
                  ) : 
                  (
                    <p>{members[0]?.user.name || members[0]?.user.id || defaultName}</p>
                  )
                }
              </Typography>
              <Typography component="span" color="textSecondary" variant="caption">
                {format(channel.state.last_message_at, 'yyyy-MM-dd hh:mm')}
              </Typography>
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
