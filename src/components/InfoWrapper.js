import { Stack, Tooltip } from '@mui/material';
import { InfoCircleTwoTone } from '@ant-design/icons';
import { useIntl } from 'react-intl';

const InfoWrapper = ({ children, tooltipText }) => {
  const intl = useIntl();

  return tooltipText && intl.formatMessage({ id: tooltipText, defaultMessage: '__null' }) != '__null' ?
    (
      <Stack direction="row" alignItems="center" spacing={0.8}>
        {children}
        <Tooltip title={intl.formatMessage({ id: tooltipText })} placement="top">
          <InfoCircleTwoTone />
        </Tooltip>
      </Stack>
    ) :
    (
      <>{children}</>
    );
};

export default InfoWrapper;
