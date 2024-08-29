import React from 'react';
import {
  PlusCircleFilled
} from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';

export const AddChannel = ({ setIsCreating, setIsEditing, onChannelSelected }) => (
  <IconButton 
  onClick={() => {
    setIsCreating((prevState) => !prevState);
    setIsEditing(false);
    onChannelSelected();
  }} 
  size="large" 
  color="primary">
    <PlusCircleFilled />
  </IconButton>
);
