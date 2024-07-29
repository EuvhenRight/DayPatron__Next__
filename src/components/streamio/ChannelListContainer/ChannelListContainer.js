import React from 'react';
import { ChannelList } from 'stream-chat-react';
import { useTheme } from '@mui/material/styles';
import { TeamChannelList } from '../TeamChannelList/TeamChannelList';
import { TeamChannelPreview } from '../TeamChannelPreview/TeamChannelPreview';
import { AddChannel } from 'assets/images/streamio';
import { 
  Typography, 
  Stack, 
  Box, 
  InputAdornment, 
  OutlinedInput, 
  useMediaQuery 
} from '@mui/material';

import SimpleBar from 'components/third-party/SimpleBar';
import {
  SearchOutlined
} from '@ant-design/icons';

// project import
import MainCard from 'components/MainCard';
import './ChannelListContainer.css';

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => channel.type === 'messaging');
};

export const ChannelListContainer = (props) => {
  const { filters, options, setIsCreating, setIsEditing, sort } = props;
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <MainCard
      sx={{
        bgcolor: matchDownLG ? 'transparent' : 'white'
      }}
      border={!matchDownLG}
      content={false}
    >
      <Box sx={{ p: 3, pb: 1 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Typography variant="h5" color="inherit">
              Groups
            </Typography>
          </Stack>

          <OutlinedInput
            fullWidth
            id="input-search-header"
            placeholder="Search"
            value={""}
            onChange={() => {}}
            sx={{
              '& .MuiOutlinedInput-input': {
                p: '10.5px 0px 12px'
              }
            }}
            startAdornment={
              <InputAdornment position="start">
                <SearchOutlined style={{ fontSize: 'small' }} />
              </InputAdornment>
            }
          />
          <AddChannel
            {...{ setIsCreating, setIsEditing }}
            type='messaging'
          />
        </Stack>
      </Box>

      <SimpleBar
        sx={{
          overflowX: 'hidden',
          height: matchDownLG ? 'calc(100vh - 120px)' : 'calc(100vh - 428px)',
          minHeight: matchDownLG ? 0 : 420
        }}
      >
        <Box sx={{ p: 3, pt: 0 }}>
          <ChannelList
            channelRenderFilterFn={customChannelMessagingFilter}
            filters={filters[1]}
            options={options}
            sort={sort}
            List={(listProps) => (
              <TeamChannelList
                {...listProps}
                {...{ setIsCreating, setIsEditing }}
                type='messaging'
              />
            )}
            Preview={(previewProps) => (
              <TeamChannelPreview
                {...previewProps}
                {...{ setIsCreating, setIsEditing }}
                type='messaging'
              />
            )}
          />
        </Box>
      </SimpleBar>
    </MainCard>
  );
};
