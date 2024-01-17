import PropTypes from 'prop-types';
import {
    Grid,
    TextField,
    Typography,
    ListItem,
    ListItemText,
    ListItemIcon,
    Stack,
    Divider,
    Switch,
    List,
    InputLabel
} from '@mui/material'

import InfoWrapper from 'components/InfoWrapper';
import IconButton from 'components/@extended/IconButton';
import { CheckOutlined, DeleteFilled, PlusCircleOutlined } from '@ant-design/icons';
import { normalizeInputValue } from 'utils/stringUtils';
import rateTypes from 'data/rateTypes';
import { useTheme } from '@mui/material/styles';

const SubscriptionPlanCard = ({ subscriptionPlan, subscriptionPlanIndex, onSubscriptionPlanChanged }) => {
    const theme = useTheme();

    const handleAddFeature = () => {
        let newSubscriptionPlan = { ...subscriptionPlan };
        if(!newSubscriptionPlan.features) newSubscriptionPlan.features = [];
        newSubscriptionPlan.features.push(null);
        onSubscriptionPlanChanged(newSubscriptionPlan, subscriptionPlanIndex);
      }

    const handleRemoveFeature = (featureIndex) => {
        let newSubscriptionPlan = { ...subscriptionPlan };
        newSubscriptionPlan.features.splice(featureIndex, 1);
        onSubscriptionPlanChanged(newSubscriptionPlan, subscriptionPlanIndex);
    }

    return (
        <Grid container spacing={2}>

            <Grid key={subscriptionPlan.id} item xs={12}>
                <Stack spacing={4}>

                    <Stack spacing={3} alignItems="center">
                        <Typography variant="h3">{subscriptionPlan?.title}</Typography>
                        <Stack alignItems="center">
                            <Typography variant="h5">&euro;{subscriptionPlan?.rateAmount} / {rateTypes.find((item) => item.code === subscriptionPlan?.rateType).itemLabel}</Typography>
                            <Typography variant="caption" color="secondary">{subscriptionPlan?.minimumDurationCycles} {rateTypes.find((item) => item.code === subscriptionPlan?.rateType).itemLabel}(s) minimum</Typography>
                        </Stack>

                        <Stack spacing={1}>
                            <InfoWrapper tooltipText="subscription_offer_plan_active_tooltip">
                                <InputLabel>Active?</InputLabel>
                            </InfoWrapper>
                            <Switch
                                edge="end"
                                onChange={(event) => {
                                    let newSubscriptionPlan = { ...subscriptionPlan };
                                    newSubscriptionPlan.isActive = event.target.checked;
                                    onSubscriptionPlanChanged(newSubscriptionPlan, subscriptionPlanIndex);
                                }}
                                checked={subscriptionPlan?.isActive}
                            />
                        </Stack>
                    </Stack>

                    <Divider />
                    <Stack spacing={1}>
                        <List sx={{ p: 0, m: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0 } }}>
                            {subscriptionPlan?.features?.map((feature, featureIndex) => (
                                <ListItem key={featureIndex}>
                                    <ListItemIcon>
                                        <CheckOutlined style={{ color: theme.palette.primary.main }}/>
                                    </ListItemIcon>
                                    <ListItemText primary={
                                        <TextField
                                            fullWidth
                                            type="text"
                                            placeholder="Enter feature"
                                            value={normalizeInputValue(feature)}
                                            onChange={(event) => {
                                                let newSubscriptionPlan = { ...subscriptionPlan };
                                                if(!newSubscriptionPlan.features) newSubscriptionPlan.features = [null, null, null, null, null, null, null, null, null, null];
                                                newSubscriptionPlan.features[featureIndex] = event.target.value;
                                                onSubscriptionPlanChanged(newSubscriptionPlan, subscriptionPlanIndex);
                                            }}
                                        />
                                    } />
                                    <IconButton onClick={() => { handleRemoveFeature(featureIndex); }} size="large" color="error">
                                        <DeleteFilled />
                                    </IconButton>
                                </ListItem>
                            ))}
                        </List>
                        
                        <Stack alignItems="flex-end">
                            <IconButton onClick={handleAddFeature} size="large" color="primary">
                                <PlusCircleOutlined />
                            </IconButton>
                        </Stack>
                    </Stack>
                </Stack>
            </Grid>
        </Grid>
    )
}

SubscriptionPlanCard.protoTypes = {
    subscriptionPlan: PropTypes.object,
    subscriptionPlanIndex: PropTypes.number,
    onSubscriptionPlanChanged: PropTypes.func
};

export default SubscriptionPlanCard;