import PropTypes from 'prop-types';
import {
    Grid,
    TextField,
    Typography
} from '@mui/material'

import { normalizeInputValue } from 'utils/stringUtils';

const SubscriptionPlanCard = ({ subscriptionPlan, subscriptionPlanIndex, onSubscriptionPlanChanged }) => {

    const padArray = (array, length, fill = '') => {
        return array.concat(Array(length).fill(fill)).slice(0, length);
    };

    return (
        <Grid container spacing={2}>

            <Grid key={subscriptionPlan.id} item xs={12}>
                <Typography variant="h1">{subscriptionPlan?.title}</Typography>
                <Typography variant="h4">€ {subscriptionPlan?.rateAmount} / month</Typography>
            </Grid>

            {padArray(subscriptionPlan?.features, 10).map((feature, index) => (
                <Grid key={index} item xs={12}>
                    <TextField
                        fullWidth
                        type="text"
                        placeholder="Enter feature"
                        value={normalizeInputValue(feature)}
                        onChange={(event) => {
                            let newSubscriptionPlan = { ...subscriptionPlan };
                            newSubscriptionPlan.features[index] = event.target.value;
                            onSubscriptionPlanChanged(newSubscriptionPlan, subscriptionPlanIndex);
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

SubscriptionPlanCard.protoTypes = {
    subscriptionPlan: PropTypes.object,
    subscriptionPlanIndex: PropTypes.number,
    onSubscriptionPlanChanged: PropTypes.func
};

export default SubscriptionPlanCard;