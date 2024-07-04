import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import {
  Button,
  Autocomplete,
  FormHelperText,
  InputLabel,
  TextField,
  Grid,
  Stack,
  FormControl,
  Select,
  MenuItem,
  Box,
  Slide,
  Pagination,
  Typography,
  useMediaQuery
} from '@mui/material';

import * as Yup from 'yup';
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import UserCard from 'sections/user/UserCard';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues, normalizeInputValue, prepareApiBody } from 'utils/stringUtils';
import MainCard from '../components/MainCard';
import { useFormik, Form, FormikProvider } from 'formik';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InfoWrapper from 'components/InfoWrapper';
import { openSnackbar } from 'store/reducers/snackbar';

const allColumns = [
  {
    id: 1,
    header: 'Id'
  },
  {
    id: 2,
    header: 'Title'
  }
];

const UsersPage = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const bindEmployers = async () => {
    try {
      var requestUrl = process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers?employerUserId=' + encodeURIComponent(personalInformation.id);

      let response = await fetch(requestUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      if (!response.ok) {
        return;
      }

      let json = await response.json();

      setEmployers(json.employers);
    } catch (error) {
      console.log(error);
    }
  }

  const bindUsers = async () => {
    try {
      var requestUrl = process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/users?employerUserId=' + encodeURIComponent(personalInformation.id);

      let response = await fetch(requestUrl,
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      if (!response.ok) {
        return;
      }

      let json = await response.json();

      setUsers(json.users);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    (async () => {
        await bindEmployers();
    })();
  }, [personalInformation?.id, keycloak?.idToken]);

  useEffect(() => {
    (async () => {
      await bindUsers();
    })();
  }, [personalInformation?.id, keycloak?.idToken]);

  useEffect(() => {
    const newUsers = users?.filter((value) => {
      if (globalFilter) {
        let searchText = value?.firstName + value?.lastName;
        return searchText?.toLowerCase()?.includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredUsers(newUsers);
  }, [globalFilter, users]);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredUsers?.length / PER_PAGE);
  const _DATA = usePagination(filteredUsers, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  const InvitationSchema = Yup.object().shape({
    invitedToEmployerId: Yup.string().max(255).required('Company is required').nullable(true),
    invitedEmail: Yup.string().max(255).email('Must be a valid email').nullable(true)
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {invitedToEmployerId: null, invitedEmail: null},
    validationSchema: InvitationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/users',
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + keycloak.idToken,
              'Content-Type': 'application/json'
            },
            body: prepareApiBody({employerId: values?.invitedToEmployerId, employerUserEmail: values?.invitedEmail})
          }
        );

        if (!response.ok) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Adding user failed.',
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

        setSubmitting(false);
        setFieldValue('invitedToEmployerId', '');
        setFieldValue('invitedEmail', '');
        await bindUsers();
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, handleBlur, handleChange, touched, handleSubmit, isSubmitting, setFieldValue, values } = formik;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MainCard>
                <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center">
                  <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
                    <GlobalFilter preGlobalFilteredRows={filteredUsers} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
                  </Stack>
                  <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
                    <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1}>
                      <Box>
                        <FormControl sx={{ minWidth: 120 }}>
                          <Select
                            value={sortBy}
                            onChange={handleChangeSort}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle1">Sort By</Typography>;
                              }

                              return <Typography variant="subtitle2">Sort by ({sortBy})</Typography>;
                            }}
                          >
                            {allColumns.map((column) => {
                              return (
                                <MenuItem key={column.id} value={column.header}>
                                  {column.header}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
            {filteredUsers?.length > 0 ? (
              _DATA
                .currentData()
                .sort(function (a, b) {
                  if (sortBy === 'Title') return compareSortValues(a?.title, b?.title);
                  if (sortBy === 'Description') return compareSortValues(a?.description, b?.description);
                  return a;
                })
                .map((user, index) => (
                  <Slide key={index} direction="up" in={true} timeout={50}>
                    <Grid item xs={12} sm={6}>
                      <UserCard user={user} bindUsers={bindUsers} />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyCardList title={'No users.'} />
            )}
            <Grid item xs={12}>
              <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
                <Pagination
                  count={count}
                  size="medium"
                  page={page}
                  showFirstButton
                  showLastButton
                  variant="combined"
                  color="primary"
                  onChange={handleChangePage}
                />
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <MainCard title="Add user">
            
            <FormikProvider value={formik}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={3}>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="user_invitation_company_tooltip">
                          <InputLabel htmlFor="user-invitation-company">Company</InputLabel>
                        </InfoWrapper>
                        <Autocomplete
                          id="user-invitation-company"
                          fullWidth
                          value={values?.invitedToEmployerId ? employers.filter((item) => item.id === values?.invitedToEmployerId)[0] : null}
                          onBlur={handleBlur}
                          onChange={(event, newValue) => {
                            setFieldValue('invitedToEmployerId', newValue === null ? '' : newValue.id);
                          }}
                          options={employers}
                          autoHighlight
                          isOptionEqualToValue={(option, value) => option.id === value?.id}
                          getOptionLabel={(option) => option.name}
                          renderOption={(props, option) => (
                            <Box component="li" {...props}>
                              {option.name}
                            </Box>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select a company"
                              name="invitedToEmployerId"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password' // disable autocomplete and autofill
                              }} />
                          )} />
                        {touched.invitedToEmployerId && errors.invitedToEmployerId && (
                          <FormHelperText error id="user-invitation-company-helper" sx={{ pl: 1.75 }}>
                            {errors.invitedToEmployerId}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1.25}>
                        <InfoWrapper tooltipText="user_invitation_email_tooltip">
                          <InputLabel htmlFor="user-invitation-email">Email</InputLabel>
                        </InfoWrapper>
                        <TextField
                          fullWidth
                          id="user-invitation-email"
                          placeholder="Email"
                          value={normalizeInputValue(values.invitedEmail)}
                          name="invitedEmail"
                          onBlur={handleBlur}
                          onChange={handleChange} />
                        {touched.invitedEmail && errors.invitedEmail && (
                          <FormHelperText error id="user-invitation-email-helper">
                            {errors.invitedEmail}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={2} alignItems="flex-end">
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                          Save
                        </Button>
                      </Stack>
                    </Grid>

                  </Grid>
                </Form>
              </LocalizationProvider>
            </FormikProvider>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export default UsersPage;
