import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useKeycloak } from '@react-keycloak/web';
import { useTheme } from '@mui/material/styles';
import {
  FormHelperText,
  Button,
  Grid,
  InputLabel,
  Stack,
  Typography
} from '@mui/material';

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { openSnackbar } from 'store/reducers/snackbar';
import { normalizeInputValue, prepareApiBody } from 'utils/stringUtils';

// ==============================|| MISSION CONTRACTOR MATCH EMPLOYER NOTES||============================== //

const getInitialValues = (employerNotes) => {
  const newEmployerNotes = {
    contractorNotes: null
  };

  if (employerNotes) {
    var result = _.merge({}, newEmployerNotes, employerNotes);

    return result;
  }

  return newEmployerNotes;
};

const MissionContractorMatchEmployerNotes = ({ missionId, contractorId }) => {
  const dispatch = useDispatch();
  const { keycloak } = useKeycloak();
  const theme = useTheme();
  const [employerNotes, setEmployerNotes] = useState(null);

  const bindData = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setEmployerNotes(json.employerNotes);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindData();
    })();
  }, []);

  const EmployerNotesSchema = Yup.object().shape({
    contractorNotes: Yup.string().max(1000).nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(employerNotes),
    validationSchema: EmployerNotesSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        var body = { ...values };

        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/employer-notes',
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
        let json = await response.json();
        setAdminNotes(json);

      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (

    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h3">Employer Notes</Typography>
          </Grid>
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
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Save
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
};

export default MissionContractorMatchEmployerNotes;
