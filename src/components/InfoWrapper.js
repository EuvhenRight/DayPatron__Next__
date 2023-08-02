import { Stack, Tooltip } from '@mui/material';
import { InfoCircleTwoTone } from '@ant-design/icons';

const InfoWrapper = ({ children, tooltipText }) => (
  <Stack direction="row" alignItems="center" spacing={0.8}>
    { children }
    <Tooltip title={tooltipText} placement="top">
      <InfoCircleTwoTone />
    </Tooltip>
  </Stack>
);

export default InfoWrapper;
