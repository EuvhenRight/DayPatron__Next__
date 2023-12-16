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
    List
} from '@mui/material'

import { DoubleRightOutlined } from '@ant-design/icons';
import { normalizeInputValue } from 'utils/stringUtils';
import rateTypes from 'data/rateTypes';

const SubscriptionPlanCard = ({ subscriptionPlan, subscriptionPlanIndex, onSubscriptionPlanChanged }) => {

    const padArray = (array, length, fill = '') => {
        return (array ?? []).concat(Array(length).fill(fill)).slice(0, length);
    };

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

                    <Divider />

                    <List sx={{ p: 0, m: 0, overflow: 'hidden', '& .MuiListItem-root': { px: 0, py: 0 } }}>
                        {padArray(subscriptionPlan?.features, 10).map((feature, featureIndex) => (
                            <ListItem key={featureIndex}>
                                <ListItemIcon>
                                    <DoubleRightOutlined />
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
                            </ListItem>
                        ))}
                    </List>

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