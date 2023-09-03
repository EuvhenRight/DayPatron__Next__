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
import MissionCard from 'sections/mission/MissionCard';
import AlertMissionDelete from 'sections/mission/AlertMissionDelete';

import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { compareSortValues } from 'utils/stringUtils';
import MainCard from 'components/MainCard';
import WelcomeBanner from 'sections/WelcomeBanner';

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

const MyMissionsSection = () => {
  const { keycloak } = useKeycloak();
  const personalInformation = useSelector(state => state.personalInformation);
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [page, setPage] = useState(1);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [missionToDelete, setMissionToDelete] = useState(null);

  const bindMissions = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/users/' + encodeURIComponent(personalInformation.id) + '/missions',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setMissions(json.missions);
      setFilteredMissions(json.missions);
    } catch (error) {
      console.log(error);
    }
  }

  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  const handleAdd = () => {
    navigate('/missions/create');
  };

  const handleDeleteAlertClose = () => {
    setOpenDeleteAlert(false);
    setMissionToDelete(null);
  };

  const alertMissionToDelete = (mission) => {
    setOpenDeleteAlert(true);
    setMissionToDelete(mission);
  };

  useEffect(() => {
    (async () => {
      await bindMissions();
    })();
  }, []);

  useEffect(() => {
    const newMissions = missions.filter((value) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setFilteredMissions(newMissions);
  }, [globalFilter]);

  const PER_PAGE = 10;

  const count = Math.ceil(filteredMissions.length / PER_PAGE);
  const _DATA = usePagination(filteredMissions, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <WelcomeBanner title="Discover Your Perfect Match in the Mission Hub" subTitle="Navigating the Future of Talent with Precision" />
        </Grid>
        <Grid item xs={12}>
          <MainCard>
            Welcome to the &apos;Mission Hub&apos;, where talent meets opportunity. Our dedicated platform supports companies to source talent for any role, whether it&apos;s fractional expertise, interim leadership, freelance specialists, or part-time professionals. By curating a dynamic pool of top-tier individuals, we empower companies to harness the exact skills they need, precisely when they&apos;re needed ensuring seamless collaborations and outstanding outcomes.
            <br/>
            <br/>
            Unleash your potential by exploring a spectrum of talent profiles, each meticulously vetted to ensure excellence. Our Mission Hub streamlines the search for experts who align seamlessly with your unique requirements. Whether you&apos;re on the hunt for a short-term project partner or a long-term collaborator, our platform is your compass to discovering the perfect match.
          </MainCard>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative', marginBottom: 3 }}>
            <Stack direction="row" alignItems="center">
              <Stack
                direction={matchDownSM ? 'column' : 'row'}
                sx={{ width: '100%' }}
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <GlobalFilter preGlobalFilteredRows={filteredMissions} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
                    Create Mission
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <Grid container spacing={3}>
            {filteredMissions.length > 0 ? (
              _DATA
                .currentData()
                .sort(function (a, b) {
                  if (sortBy === 'Title') return compareSortValues(a?.title, b?.title);
                  if (sortBy === 'Description') return compareSortValues(a?.description, b?.description);
                  return a;
                })
                .map((mission, index) => (
                  <Slide key={index} direction="up" in={true} timeout={50}>
                    <Grid item xs={12} sm={6} lg={4}>
                      <MissionCard mission={mission} alertMissionToDelete={alertMissionToDelete} />
                    </Grid>
                  </Slide>
                ))
            ) : (
              <EmptyCardList title={'No missions.'} />
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
        </Grid>
      </Grid>

      <AlertMissionDelete mission={missionToDelete} open={openDeleteAlert} handleClose={handleDeleteAlertClose} bindMissions={bindMissions} />
    </>
  );
};

export default MyMissionsSection;
