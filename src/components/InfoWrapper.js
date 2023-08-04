import { Stack, Tooltip } from '@mui/material';
import { InfoCircleTwoTone } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useTheme } from '@mui/material/styles';

const InfoWrapper = ({ children, tooltipText }) => {
  const theme = useTheme();
  const intl = useIntl();

  return tooltipText && intl.formatMessage({ id: tooltipText, defaultMessage: '__null' }) != '__null' ?
    (
      <Stack direction="row" alignItems="center" spacing={0.8}>
        {children}
        <Tooltip title={intl.formatMessage({ id: tooltipText })} placement="top">
          <InfoCircleTwoTone twoToneColor={theme.palette.primary.main} />
        </Tooltip>
      </Stack>
    ) :
    (
      <>{children}</>
    );
};

export default InfoWrapper;
