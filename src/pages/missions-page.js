import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import jobClusters from 'data/jobClusters';

// material-ui
import {
  Autocomplete,
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

// project import
import EmptyCardList from 'components/cards/skeleton/EmptyCardList';
import MissionCard from 'sections/mission/MissionCard';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';
import MainCard from '../components/MainCard';

// ==============================|| MISSIONS - PAGE ||============================== //

const allColumns = [
  {
    id: 1,
    header: 'Id'
  },
  {
    id: 2,
    header: 'Title'
  },
  {
    id: 3,
    header: 'Description'
  }
];

var booleanFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' }
];

const MissionsPage = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [page, setPage] = useState(1);

  const [isInvitedFilter, setIsInvitedFilter] = useState('all');
  const [isAppliedFilter, setIsAppliedFilter] = useState('all');
  const [isMatchedFilter, setIsMatchedFilter] = useState('all');
  const [jobClustersFilter, setJobClustersFilter] = useState(null);
  const [tagsFilter, setTagsFilter] = useState(null);
  
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const bindMissions = async () => {
    try {
      var requestUrl = process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/contractors/' + encodeURIComponent(personalInformation.id) + '/missions?q=1';

      if (isInvitedFilter !== 'all')
        requestUrl += '&isInvited=' + isInvitedFilter;

      if (isAppliedFilter !== 'all')
        requestUrl += '&isApplied=' + isAppliedFilter;

      if (isMatchedFilter !== 'all')
        requestUrl += '&isMatched=' + isMatchedFilter;

      if (jobClustersFilter?.length > 0) {
        jobClustersFilter.map((jobCluster) => {
          requestUrl += '&jobClusters=' + jobCluster.code;
        });
      }

      if (tagsFilter?.length > 0)
        tagsFilter.map((tag) => {
          requestUrl += '&tags=' + tag;
        });

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

      setMissions(json.contractorMissions);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    (async () => {
      await bindMissions();
    })();
  }, [personalInformation?.id, keycloak?.idToken, isInvitedFilter, isAppliedFilter, isMatchedFilter, jobClustersFilter, tagsFilter]);

  useEffect(() => {
    const newMissions = missions.filter((value) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredMissions(newMissions);
  }, [globalFilter, missions]);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredMissions?.length / PER_PAGE);
  const _DATA = usePagination(filteredMissions, PER_PAGE);

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

                <Grid item>
                  <Stack>
                    <Box>
                      <FormControl sx={{ minWidth: 120 }} fullWidth>
                        <Autocomplete
                          multiple
                          fullWidth
                          options={jobClusters ?? []}
                          value={jobClustersFilter ?? []}
                          onChange={(event, newValue) => {
                            setJobClustersFilter(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Job Clusters"
                              name="jobClusters"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />
                      </FormControl>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item>
                  <Stack>
                    <Box>
                      <FormControl sx={{ minWidth: 120 }} fullWidth>
                        <Autocomplete
                          multiple
                          fullWidth
                          options={personalInformation?.tags ?? []}
                          value={tagsFilter ?? []}
                          onChange={(event, newValue) => {
                            setTagsFilter(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Tags"
                              name="tags"
                              inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password'
                              }}
                            />
                          )}
                        />
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
                    <GlobalFilter preGlobalFilteredRows={filteredMissions} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
            {filteredMissions?.length > 0 ? (
              _DATA
                .currentData()
                .sort(function (a, b) {
                  if (sortBy === 'Title') return compareSortValues(a?.title, b?.title);
                  if (sortBy === 'Description') return compareSortValues(a?.description, b?.description);
                  return a;
                })
                .map((mission, index) => (
                  <Slide key={index} direction="up" in={true} timeout={50}>
                    <Grid item xs={12} sm={6} md={4}>
                      <MissionCard mission={mission} />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyCardList title={'No missions.'} />
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

export default MissionsPage;
