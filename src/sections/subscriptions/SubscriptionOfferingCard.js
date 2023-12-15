import PropTypes from 'prop-types';

// Material - UI components
import {
    Grid,
    // TextField,
} from '@mui/material'


import SubscriptionPlanCard from 'sections/subscriptions/SubscriptionPlanCard';

const SubscriptionOfferingCard = ({ subscriptionOffer }) => {
    return (

        <Grid container spacing={2.25}>
            <Grid item xs={12}>
                {subscriptionOffer?.summary}
            </Grid>
            {subscriptionOffer?.subscriptionPlans?.map((plan, index) => (
                <Grid key={index} item xs={12} md={4}>
                    <SubscriptionPlanCard subscriptionPlan={plan} onSubscriptionPlanChanged={plan} />
                </Grid>
            ))}
        </Grid>
    )
};

SubscriptionOfferingCard.protoTypes = {
    subscriptionOffer: PropTypes.object.isRequired
};

export default SubscriptionOfferingCard;