import React from 'react';
import { Button } from '@mui/material';

export const AddChannel = ({ setIsCreating, setIsEditing }) => (
  <Button 
    variant="contained"
    onClick={() => {
      setIsCreating((prevState) => !prevState);
      setIsEditing(false);
    }}
  >
    Add
  </Button>
);
