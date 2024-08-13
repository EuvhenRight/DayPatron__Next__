import React from 'react';
import {
  PlusCircleFilled
} from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';

export const AddChannel = ({ setIsCreating, setIsEditing }) => (
  <IconButton 
  onClick={() => {
    setIsCreating((prevState) => !prevState);
    setIsEditing(false);
  }} 
  size="large" 
  color="error">
    <PlusCircleFilled />
  </IconButton>
);
