import PropTypes from 'prop-types';
import {
    Grid,
    TextField,
    InputLabel,
    Stack,
    Autocomplete
} from '@mui/material'
import MainCard from 'components/MainCard';
import { normalizeInputValue } from 'utils/stringUtils';
import SubscriptionPlanCard from 'sections/subscriptions/SubscriptionPlanCard';
import InfoWrapper from 'components/InfoWrapper';
import jobClusters from 'data/jobClusters';

const SubscriptionOfferingCard = ({ subscriptionOffer, subscriptionOfferIndex, onSubscriptionOfferChanged }) => {

    const onSubscriptionPlanChanged = (updatedSubscriptionPlan, updatedSubscriptionPlanIndex) => {
        let newSubscriptionPlans = subscriptionOffer.plans.map((subscriptionPlan, subscriptionPlanIndex) => {
            if (subscriptionPlanIndex === updatedSubscriptionPlanIndex)
                return updatedSubscriptionPlan;

             return subscriptionPlan;
        });

        let newSubscriptionOffer = {...subscriptionOffer};
        newSubscriptionOffer.plans = newSubscriptionPlans;

        onSubscriptionOfferChanged(newSubscriptionOffer, subscriptionOfferIndex);
    }

    return (
        <Grid container spacing={2.25}>
            <Grid item xs={12}>
                <MainCard>
                    <Grid container spacing={2.25}>
                        <Grid item xs={12}>
                            <Stack spacing={1.25}>
                                <InfoWrapper tooltipText="subscription_offer_summary_tooltip">
                                    <InputLabel>Summary</InputLabel>
                                </InfoWrapper>
                                <TextField
                                    multiline
                                    rows={3}
                                    fullWidth
                                    type="text"
                                    placeholder="Enter summary"
                                    value={normalizeInputValue(subscriptionOffer?.summary)}
                                    onChange={(event) => {
                                        let newSubscriptionOffer = {...subscriptionOffer};
                                        newSubscriptionOffer.summary = event.target.value;

                                        onSubscriptionOfferChanged(newSubscriptionOffer, subscriptionOfferIndex);
                                    }}
                                />
                            </Stack>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack spacing={1.25}>
                                <InfoWrapper tooltipText="subscription_offer_clusters_tooltip">
                                    <InputLabel>Clusters</InputLabel>
                                </InfoWrapper>
                                <Autocomplete
                                    fullWidth
                                    multiple
                                    options={jobClusters}
                                    value={jobClusters.filter(x => subscriptionOffer?.clusters?.find(y => x.code === y)) ?? []}
                                    getOptionLabel={(option) => option?.label}
                                    isOptionEqualToValue={(option, value) => option.code === value?.code}
                                    onChange={(event, newValue) => {
                                        let newSubscriptionOffer = {...subscriptionOffer};
                                        newSubscriptionOffer.clusters = newValue.map((cluster) => {return cluster.code;});

                                        onSubscriptionOfferChanged(newSubscriptionOffer, subscriptionOfferIndex);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Select clusters"
                                            inputProps={{
                                            ...params.inputProps,
                                            autoComplete: 'new-password'
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Grid>
                    </Grid>
                </MainCard>
            </Grid>
            {subscriptionOffer?.plans?.map((plan, index) => (
                <Grid key={index} item xs={12} md={4}>
                    <MainCard>
                        <SubscriptionPlanCard subscriptionPlan={plan} subscriptionPlanIndex={index} onSubscriptionPlanChanged={onSubscriptionPlanChanged} />
                    </MainCard>
                </Grid>
            ))}
        </Grid>
    )
};

SubscriptionOfferingCard.protoTypes = {
    subscriptionOffer: PropTypes.object,
    subscriptionOfferIndex: PropTypes.number,
    onSubscriptionOfferChanged: PropTypes.func
};

export default SubscriptionOfferingCard;