import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

// material-ui
import {
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

// project import
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import MissionContractorMatchCard from 'sections/mission/MissionContractorMatchCard';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';
import MainCard from '../components/MainCard';

// ==============================|| MISSION MATCHES - PAGE ||============================== //

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

var booleanFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
];

const MissionMatchesPage = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [missionMatches, setMissionMatches] = useState([]);
  const [filteredMissionMatches, setFilteredMissionMatches] = useState([]);
  const [page, setPage] = useState(1);

  const [isInvitedFilter, setIsInvitedFilter] = useState('all');
  const [isAppliedFilter, setIsAppliedFilter] = useState('all');
  const [isMatchedFilter, setIsMatchedFilter] = useState('all');

  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const bindMissionMatches = async () => {
    try {
      var requestUrl = process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/users/' + encodeURIComponent(personalInformation.id) + '/missions/matches?q=1';

      if (isInvitedFilter !== 'all')
        requestUrl += '&isInvited=' + isInvitedFilter;

      if (isAppliedFilter !== 'all')
        requestUrl += '&isApplied=' + isAppliedFilter;

      if (isMatchedFilter !== 'all')
        requestUrl += '&isMatched=' + isMatchedFilter;

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

      setMissionMatches(json.matches);
      setFilteredMissionMatches(json.matches);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    (async () => {
      await bindMissionMatches();
    })();
  }, [isInvitedFilter, isAppliedFilter, isMatchedFilter]);

  useEffect(() => {
    const newMissionMatches = missionMatches.filter((value) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredMissionMatches(newMissionMatches);
  }, [globalFilter]);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredMissionMatches?.length / PER_PAGE);
  const _DATA = usePagination(filteredMissionMatches, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <MainCard title="Filter">
            <Stack spacing={0.5}>

              <Grid container direction="column" rowSpacing={3}>
                <Grid item>
                  <Stack>
                    <Box>
                      <FormControl sx={{ minWidth: 120 }} fullWidth>
                        <Select
                          value={isInvitedFilter}
                          onChange={(event) => {
                            setIsInvitedFilter(event.target.value);
                          }}
                          inputProps={{ 'aria-label': 'Without label' }}
                          renderValue={() => {
                            return <Typography variant="subtitle2">Invited ({booleanFilterOptions.find(x => x.value === isInvitedFilter).label})</Typography>;
                          }}
                        >
                          {booleanFilterOptions.map((option, optionIndex) => {
                            return (
                              <MenuItem key={optionIndex} value={option.value}>
                                {option.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item>
                  <Stack>
                    <Box>
                      <FormControl sx={{ minWidth: 120 }} fullWidth>
                        <Select
                          value={isAppliedFilter}
                          onChange={(event) => {
                            setIsAppliedFilter(event.target.value);
                          }}
                          inputProps={{ 'aria-label': 'Without label' }}
                          renderValue={() => {
                            return <Typography variant="subtitle2">Applied ({booleanFilterOptions.find(x => x.value === isAppliedFilter).label})</Typography>;
                          }}
                        >
                          {booleanFilterOptions.map((option, optionIndex) => {
                            return (
                              <MenuItem key={optionIndex} value={option.value}>
                                {option.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item>
                  <Stack>
                    <Box>
                      <FormControl sx={{ minWidth: 120 }} fullWidth>
                        <Select
                          value={isMatchedFilter}
                          onChange={(event) => {
                            setIsMatchedFilter(event.target.value);
                          }}
                          inputProps={{ 'aria-label': 'Without label' }}
                          renderValue={() => {
                            return <Typography variant="subtitle2">Matched ({booleanFilterOptions.find(x => x.value === isMatchedFilter).label})</Typography>;
                          }}
                        >
                          {booleanFilterOptions.map((option, optionIndex) => {
                            return (
                              <MenuItem key={optionIndex} value={option.value}>
                                {option.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  </Stack>
                </Grid>

              </Grid>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MainCard>
                <Stack direction={matchDownSM ? 'column' : 'row'} spacing={1} justifyContent="space-between" alignItems="center">
                  <Stack direction={matchDownSM ? 'column' : 'row'} spacing={2}>
                    <GlobalFilter preGlobalFilteredRows={filteredMissionMatches} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
            {filteredMissionMatches?.length > 0 ? (
              _DATA
                .currentData()
                .sort(function (a, b) {
                  if (sortBy === 'Title') return compareSortValues(a?.title, b?.title);
                  if (sortBy === 'Description') return compareSortValues(a?.description, b?.description);
                  return a;
                })
                .map((missionMatch, index) => (
                  <Slide key={index} direction="up" in={true} timeout={50}>
                    <Grid item xs={12} sm={6} md={4}>
                      <MissionContractorMatchCard missionContractorMatch={missionMatch} missionId={missionMatch?.mission?.id} />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyCardList title={'No matches.'} />
            )}
          </Grid>
        </Grid>
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

export default MissionMatchesPage;
