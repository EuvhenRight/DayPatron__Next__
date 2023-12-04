import PropTypes from 'prop-types';

// material-ui
import {
  Grid,
  Stack,
  TextField,
  InputLabel
} from '@mui/material'

import {
  DeleteFilled
} from '@ant-design/icons';
import IconButton from 'components/@extended/IconButton';

import { normalizeInputValue } from 'utils/stringUtils';

const SubscriptionPlanTemplateCard = ({ template, templateIndex, onTemplateUpdated, onTemplateRemoved }) => {
  return (
    <Grid container spacing={2.25}>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          <IconButton onClick={() => { onTemplateRemoved(templateIndex); }} size="large" color="error">
            <DeleteFilled />
          </IconButton>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1.25}>
          <InputLabel htmlFor="subscription-plan-template-title">Title</InputLabel>
          <TextField
            fullWidth
            id="subscription-plan-template-title"
            placeholder="Enter title"
            name="title"
            value={normalizeInputValue(template?.title)}
            onChange={(event) => {onTemplateUpdated({ ...template, title: event.target.value }, templateIndex);}}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1.25}>
          <InputLabel htmlFor="subscription-plan-template-rate-amount">Rate Amount</InputLabel>
          <TextField
            fullWidth
            id="subscription-plan-template-rate-amount"
            type="number"
            inputProps={{ min: 0, max: 1000000 }}
            placeholder="Enter rate amount"
            name="rateAmount"
            value={normalizeInputValue(template?.rateAmount)}
            onChange={(event) => {onTemplateUpdated({ ...template, rateAmount: event.target.value }, templateIndex);}}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={1.25}>
          <InputLabel htmlFor="subscription-plan-template-minimum-duration-cycles">Minimum Duration Cycles</InputLabel>
          <TextField
            fullWidth
            id="subscription-plan-template-minimum-duration-cycles"
            type="number"
            inputProps={{ min: 0, max: 1000000 }}
            placeholder="Enter minimum duration cycles"
            name="minimumDurationCycles"
            value={normalizeInputValue(template?.minimumDurationCycles)}
            onChange={(event) => {onTemplateUpdated({ ...template, minimumDurationCycles: event.target.value }, templateIndex);}}
          />
        </Stack>
      </Grid>
    </Grid>
  );
};

SubscriptionPlanTemplateCard.propTypes = {
  template: PropTypes.object
};

export default SubscriptionPlanTemplateCard;