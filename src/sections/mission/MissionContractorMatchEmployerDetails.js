import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { useTheme } from '@mui/material/styles';
import {
  FormHelperText,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputLabel,
  Stack
} from '@mui/material';

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { openSnackbar } from 'store/reducers/snackbar';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';

// ==============================|| MISSION CONTRACTOR MATCH EMPLOYER DETAILS||============================== //

const getInitialValues = (employerDetails) => {
  const newEmployerDetails = {
    contractorNotes: null
  };

  if (employerDetails) {
    var result = _.merge({}, newEmployerDetails, employerDetails);

    return result;
  }

  return newEmployerDetails;
};

const MissionContractorMatchEmployerDetails = ({ missionId, contractorId }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const theme = useTheme();
  const [employerDetails, setEmployerDetails] = useState(null);

  const bindData = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/employer-details',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setEmployerDetails(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindData();
    })();
  }, []);

  const EmployerDetailsSchema = Yup.object().shape({
    contractorNotes: Yup.string().max(1000).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(employerDetails),
    validationSchema: EmployerDetailsSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/employer-details',
          {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + keycloak.idToken,
              'Content-Type': 'application/json'
            },
            body: prepareApiBody(body)
          }
        );

        if (!response.ok) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Update failed.',
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
            message: 'Data updated.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );

        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (

    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogTitle>Employer Details</DialogTitle>
        <Divider />

        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}
              sx={{
                '& .quill': {
                  borderRadius: '4px',
                  '& .ql-toolbar': {
                    bgcolor: theme.palette.mode === 'dark' ? 'dark.light' : 'grey.100',
                    borderColor: theme.palette.divider,
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px'
                  },
                  '& .ql-container': {
                    borderColor: `${theme.palette.divider} !important`,
                    borderBottomLeftRadius: '4px',
                    borderBottomRightRadius: '4px',
                    '& .ql-editor': {
                      minHeight: 135
                    }
                  }
                }
              }}
            >
              <Stack spacing={1.25}>
                <InputLabel htmlFor="match-employer-contractor-notes">Notes About the Contractor</InputLabel>
                <ReactQuill
                  id="match-employer-contractor-notes"
                  value={normalizeInputValue(values.contractorNotes)}
                  onChange={(e) => setFieldValue('contractorNotes', e)}
                />
                {touched.contractorNotes && errors.contractorNotes && (
                  <FormHelperText error id="match-employer-contractor-notes-helper">
                    {errors.contractorNotes}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Save
            </Button>
          </Stack>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
};

export default MissionContractorMatchEmployerDetails;
