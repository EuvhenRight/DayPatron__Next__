// Material-UI components
import {
    Grid,
    TextField,
    Typography
} from '@mui/material'

// Utils
import { normalizeInputValue } from 'utils/stringUtils';

const SubscriptionPlanCard = ({ subscriptionPlan, onSubscriptionPlanChanged }) => {

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
                        id={`subscription-plan-feature${index}`}
                        type="text"
                        placeholder="Enter feature list"
                        name="feature"
                        // name={`feature${index}`}
                        value={normalizeInputValue(feature)}
                        onChange={(event) => {
                            subscriptionPlan.features[index] = event.target.value;
                            onSubscriptionPlanChanged({ ...subscriptionPlan });
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default SubscriptionPlanCard;