import { useState, useEffect } from 'react';

// material-ui
import {
  Grid,
  Stack,
  useMediaQuery,
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
import MissionContractorMatchCard from 'sections/mission/MissionContractorMatchCard';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';

// ==============================|| MISSION CONTRACTOR MATCHES ||============================== //

const allColumns = [
  {
    id: 1,
    header: 'Id'
  },
  {
    id: 2,
    header: 'First Name'
  },
  {
    id: 3,
    header: 'Last Name'
  },
  {
    id: 4,
    header: 'Email'
  },
  {
    id: 5,
    header: 'LinkedIn'
  }
];

const MissionContractorMatches = ({ missionId }) => {
  const { keycloak } = useKeycloak();
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [missionContractorMatches, setMissionContractorMatches] = useState([]);
  const [filteredMissionContractorMatches, setFilteredMissionContractorMatches] = useState([]);
  const [page, setPage] = useState(1);

  const bindMissionContractorMatches = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/matches',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setMissionContractorMatches(json.missionContractorMatches);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    (async () => {
      await bindMissionContractorMatches();
    })();
  }, [keycloak?.idToken, missionId]);

  useEffect(() => {
    const newMissionContractorMatches = missionContractorMatches.filter((value) => {
      if (globalFilter) {
        return value.name.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredMissionContractorMatches(newMissionContractorMatches);
  }, [globalFilter, missionContractorMatches]);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredMissionContractorMatches.length / PER_PAGE);
  const _DATA = usePagination(filteredMissionContractorMatches, PER_PAGE);

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
            <GlobalFilter preGlobalFilteredRows={filteredMissionContractorMatches} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {filteredMissionContractorMatches.length > 0 ? (
          _DATA
            .currentData()
            .sort(function (a, b) {
              if (sortBy === 'First Name') return compareSortValues(a?.contractor?.firstName, b?.contractor?.firstName);
              if (sortBy === 'Last Name') return compareSortValues(a?.contractor?.lastName, b?.contractor?.lastName);
              if (sortBy === 'Email') return compareSortValues(a?.contractor?.email, b?.contractor?.email);
              if (sortBy === 'LinkedIn') return compareSortValues(a?.contractor?.linkedInUrl, b?.contractor?.linkedInUrl);
              return a;
            })
            .map((missionContractorMatch, index) => (
              <Slide key={index} direction="up" in={true} timeout={50}>
                <Grid item xs={12} sm={6} lg={4}>
                  <MissionContractorMatchCard missionContractorMatch={missionContractorMatch} missionId={missionId} />
                </Grid>
              </Slide>
            ))
        ) : (
          <EmptyCardList title={'No matches.'} />
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
    </>
  );
};

export default MissionContractorMatches;
