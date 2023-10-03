import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import {
  Grid,
  Stack,
  useMediaQuery,
  Button,
  FormControl,
  Select,
  MenuItem,
  Box,
  Slide,
  Pagination,
  Typography
} from '@mui/material';

// project import
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import EmployerCard from 'sections/employer/EmployerCard';
import AlertEmployerDelete from 'sections/employer/AlertEmployerDelete';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';

// ==============================|| EMPLOYERS - PAGE ||============================== //

const allColumns = [
  {
    id: 1,
    header: 'Id'
  },
  {
    id: 2,
    header: 'Name'
  },
  {
    id: 3,
    header: 'Email'
  },
  {
    id: 4,
    header: 'Industry'
  },
  {
    id: 5,
    header: 'Chamber Of Commerce Identifier'
  },
  {
    id: 6,
    header: 'LinkedIn'
  }
];

const MyEmployersSection = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [employers, setEmployers] = useState([]);
  const [filteredEmployers, setFilteredEmployers] = useState([]);
  const [page, setPage] = useState(1);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [employerToDelete, setEmployerToDelete] = useState(null);

  const bindEmployers = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers?employerUserId=' + encodeURIComponent(personalInformation.id),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setEmployers(json.employers);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  const handleAdd = () => {
    navigate('/companies/create');
  };

  const handleDeleteAlertClose = () => {
    setOpenDeleteAlert(false);
    setEmployerToDelete(null);
  };

  const alertEmployerToDelete = (employer) => {
    setOpenDeleteAlert(true);
    setEmployerToDelete(employer);
  };

  useEffect(() => {
    (async () => {
      await bindEmployers();
    })();
  }, [personalInformation?.id, keycloak?.idToken]);

  useEffect(() => {
    const newEmployers = employers.filter((value) => {
      if (globalFilter) {
        return value.name.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredEmployers(newEmployers);
  }, [globalFilter, employers]);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredEmployers.length / PER_PAGE);
  const _DATA = usePagination(filteredEmployers, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <GlobalFilter preGlobalFilteredRows={filteredEmployers} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
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
              <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
                Create Company
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {filteredEmployers.length > 0 ? (
          _DATA
            .currentData()
            .sort(function (a, b) {
              if (sortBy === 'Name') return compareSortValues(a?.name, b?.name);
              if (sortBy === 'Email') return compareSortValues(a?.email, b?.email);
              if (sortBy === 'Industry') return compareSortValues(a?.industry, b?.industry);
              if (sortBy === 'Chamber Of Commerce Identifier') return compareSortValues(a?.chamberOfCommerceIdentifier, b?.chamberOfCommerceIdentifier);
              if (sortBy === 'LinkedIn') return compareSortValues(a?.linkedInUrl, b?.linkedInUrl);
              return a;
            })
            .map((employer, index) => (
              <Slide key={index} direction="up" in={true} timeout={50}>
                <Grid item xs={12} sm={6} lg={4}>
                  <EmployerCard employer={employer} alertEmployerToDelete={alertEmployerToDelete} />
                </Grid>
              </Slide>
            ))
        ) : (
          <EmptyCardList title={'No companies.'} />
        )}
      </Grid>
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

      <AlertEmployerDelete employer={employerToDelete} open={openDeleteAlert} handleClose={handleDeleteAlertClose} bindEmployers={bindEmployers} />
    </>
  );
};

export default MyEmployersSection;
