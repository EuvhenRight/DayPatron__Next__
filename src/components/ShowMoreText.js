import { useState } from 'react';
import { Link } from '@mui/material';

const ShowMoreText = ({text, maxLength}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if(text.length <= maxLength) {
    return <>{text}</>
  }

  return (
    <>
      {
        isExpanded ?
        (<>
          {text}
          <Link sx={{textWrap: 'nowrap', pl: '5px'}} href="#" onClick={() => setIsExpanded(false)}>Show Less</Link>
        </>)
        :
        (<>
          {text.substring(0, maxLength) + '...'}
          <Link sx={{textWrap: 'nowrap', pl: '5px'}} href="#" onClick={() => setIsExpanded(true)}>Show More</Link>
        </>) 
      }
    </>
  );
}

export default ShowMoreText;
