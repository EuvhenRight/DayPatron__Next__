// material-ui
import { Typography } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

const MyProductsPage = () => {
  return (
    <MainCard title="Sample Card">
      <Typography variant="body2">
        MyProductsPage
      </Typography>
    </MainCard>
  );
};

export default MyProductsPage;
