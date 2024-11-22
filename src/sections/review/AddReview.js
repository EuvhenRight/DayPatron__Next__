import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';

import { Grid, Rating, Stack, Typography, TextField, Button } from '@mui/material';

import { StarFilled, StarOutlined } from '@ant-design/icons';

import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import { normalizeInputValue, normalizeNullableInputValue, prepareApiBody } from 'utils/stringUtils';
import { openSnackbar } from 'store/reducers/snackbar';
import { ReviewsContext } from 'sections/review/ReviewsContext';

const AddReview = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector((state) => state.personalInformation);
  const admin = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const { targetItemType, targetItemId, bindReviewData } = useContext(ReviewsContext);

  const ValidationSchema = Yup.object().shape({
    score: Yup.number()
      .test('is-int', 'Invalid score', (value) => {
        if (!value) return true;
        return (value + '').match(/^\d*$/);
      })
      .max(0)
      .max(5)
      .nullable(true),
    body: Yup.string().nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { score: null, body: null },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/reviews', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          },
          body: prepareApiBody({
            sourceUserType: admin.workAsAdmin ? 'Admin' : 'EmployerUser',
            sourceUserId: admin.workAsAdmin ? null : personalInformation.id,
            score: values.score,
            body: values.body,
            targetItemType,
            targetItemId
          })
        });

        if (!response.ok) {
          dispatch(
            openSnackbar({
              open: true,
              message: (await response.text()) ?? 'Posting review failed.',
              variant: 'alert',
              alert: {
                color: 'error'
              },
              close: false
            })
          );
          setSubmitting(false);
          return;
        }

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

        let json = await response.json();
        await bindReviewData(json);

        setFieldValue('score', null);
        setFieldValue('body', null);
        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  useEffect(() => {
    if (window.location.hash) {
      const element = document.getElementById(window.location.hash.replace('#', ''));
      if (element) {
        setTimeout(function () {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
      }
    }
  }, [window.location]);

  const { handleBlur, handleChange, handleSubmit, isSubmitting, values, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h5" id="new-review">
              New review
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Rating
              value={normalizeNullableInputValue(values.score)}
              onChange={(event, newValue) => {
                setFieldValue('score', newValue);
              }}
              icon={<StarFilled style={{ fontSize: 'inherit' }} />}
              emptyIcon={<StarOutlined style={{ fontSize: 'inherit' }} />}
              precision={1}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              rows={5}
              fullWidth
              id="review-body"
              value={normalizeInputValue(values.body)}
              name="body"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Review text"
              autoFocus
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
              <Button disabled={isSubmitting || !values.score} type="submit" variant="contained">
                Post review
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default AddReview;
