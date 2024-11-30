import React from 'react';
import { format } from 'date-fns';

export const Timestamp = ({ timestamp, formatString = 'dd/MM/yyyy HH:mm:ss' }) => {
  const formattedDate = format(new Date(timestamp), formatString);
  return <time dateTime={timestamp}>{formattedDate}</time>;
};

export const TimeStartAndEndTimestamp = ({ formatString = 'dd/MM/yyyy' }) => {
  const formattedDate = format(new Date(), formatString);
  return <time>{formattedDate}</time>;
};
