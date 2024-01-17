// React and Redux
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Third-party libraries
import { useKeycloak } from '@react-keycloak/web';

// Store actions
import { openSnackbar } from 'store/reducers/snackbar';

// Material-UI components
import {
    Button,
    Grid,
    Stack
} from '@mui/material';

// Local components
import MainCard from 'components/MainCard';
import UpsertSubscriptionOffering from 'sections/subscriptions/UpsertSubscriptionOffering';
import WelcomeBanner from 'sections/WelcomeBanner';

// Utils
import { prepareApiBody } from 'utils/stringUtils';


const SubscriptionOfferingPage = () => {
    const { keycloak } = useKeycloak();
    const [subscriptionOffers, setSubscriptionOffers] = useState([]);
    const personalInformation = useSelector(state => state.personalInformation);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            await bindSubscriptionOffers();
        })();
    }, [personalInformation?.id, keycloak?.idToken]);

    const bindSubscriptionOffers = async () => {
        try {
            let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/subscription-offers',
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + keycloak.idToken
                    }
                });

            let json = await response.json();
            setSubscriptionOffers(json?.offers);
        } catch (error) {
            console.log(error);
        }
    }

    const onSubscriptionOfferChanged = (updatedSubscriptionOffer, updatedSubscriptionOfferIndex) => {
        let newSubscriptionOffers = subscriptionOffers.map((subscriptionOffer, subscriptionOfferIndex) => {
            if (subscriptionOfferIndex === updatedSubscriptionOfferIndex)
                return updatedSubscriptionOffer;

             return subscriptionOffer;
        });
        setSubscriptionOffers(newSubscriptionOffers);
    }

    const handleSaveClick = async () => {
        try {
            let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/subscription-offers',
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + keycloak.idToken,
                        'Content-Type': 'application/json'
                    },
                    body: prepareApiBody({ offers: subscriptionOffers })
                }
            );

            if (!response.ok) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Save failed.',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: false
                    })
                );

                return;
            }

            let json = await response.json();
            setSubscriptionOffers(json?.offers);

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Saved.',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );

        } catch (error) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Save failed.',
                    variant: 'alert',
                    alert: {
                        color: 'error'
                    },
                    close: false
                })
            );
            console.log(error);
        }
    };

    return (

        <Grid container spacing={3}>
            <Grid item xs={12}>
                <WelcomeBanner title="Craft Your Exclusive Subscription Offering Experience" subTitle="Shape Exclusive Plans for a One-of-a-Kind Experience" />
            </Grid>
            <Grid item xs={12}>
                <MainCard>
                    We&apos;re thrilled that you are ready to offer a subscription plan to your dedicated audience.
                    This is your space to customize and tailor a subscription offering that aligns perfectly with your unique offerings and the expectations of your community.
                    Once you&apos;ve fine-tuned your subscription offering to perfection, hit the &quot;Save&quot; button to apply the changes. 
                    Do not forget to hit the toggle button to activate a plan. If you have an active plan and you save your subscription offering it will be published and companies will be able to subscribe to your activeplans.
                </MainCard>
            </Grid>

            {subscriptionOffers?.map((offer, index) => (
                <Grid key={index} item xs={12}>
                    <UpsertSubscriptionOffering
                        subscriptionOffer={offer}
                        subscriptionOfferIndex={index}
                        onSubscriptionOfferChanged={onSubscriptionOfferChanged}
                    >
                    </UpsertSubscriptionOffering>
                </Grid>
            ))}
            <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                    <Button onClick={handleSaveClick} color="primary" variant="contained">
                        Save
                    </Button>
                </Stack>
            </Grid>
        </Grid >
    );
};
export default SubscriptionOfferingPage;