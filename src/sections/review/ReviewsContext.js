import React, { createContext, useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';

export const ReviewsContext = createContext();

export const ReviewsContextProvider = ({ children, targetItemType, targetItemId }) => {
  const { keycloak } = useKeycloak();
  const [reviewData, setReviewData] = useState(null);

  useEffect(() => {
    (async () => {
      if (targetItemType && targetItemId) {
        await bindReviewData();
      }
    })();
  }, [targetItemType, targetItemId, keycloak?.idToken]);

  const bindReviewData = async (newReviewData) => {
    try {
      if(!newReviewData){
        let response = await fetch(
          process.env.REACT_APP_JOBMARKET_API_BASE_URL +
            '/reviews?targetItemType=' +
            targetItemType +
            '&targetItemId=' +
            encodeURIComponent(targetItemId),
          {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + keycloak.idToken
            }
          }
        );
  
        newReviewData = await response.json();
      }

      setReviewData(newReviewData);
    } catch (error) {
      console.log(error);
    }
  };

  return <ReviewsContext.Provider value={{ targetItemType, targetItemId, reviewData, bindReviewData }}>{children}</ReviewsContext.Provider>;
};
