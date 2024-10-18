import { Stack, Tooltip, ClickAwayListener } from '@mui/material';
import { useState } from 'react';
import { InfoCircleTwoTone } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useTheme } from '@mui/material/styles';

const InfoWrapper = ({ children, tooltipText }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const intl = useIntl();

  return tooltipText && intl.formatMessage({ id: tooltipText, defaultMessage: '__null' }) != '__null' ? (
    <Stack direction="row" alignItems="center" spacing={0.8}>
      {children}

      <ClickAwayListener
        onClickAway={() => {
          setOpen(false);
        }}
      >
        <Tooltip
          PopperProps={{
            disablePortal: true
          }}
          onClose={() => {
            setOpen(false);
          }}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={intl.formatMessage({ id: tooltipText })}
          placement="top"
        >
          <InfoCircleTwoTone
            twoToneColor={theme.palette.primary[400]}
            onClick={() => {
              setOpen(true);
            }}
          />
        </Tooltip>
      </ClickAwayListener>
    </Stack>
  ) : (
    <>{children}</>
  );
};

export default InfoWrapper;
