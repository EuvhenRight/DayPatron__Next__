import { useMemo, useState, useEffect } from 'react';

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
import EmptyMissions from 'components/cards/skeleton/EmptyMissions';
import MissionCard from 'sections/MissionCard';
import AlertMissionDelete from 'sections/AlertMissionDelete';

import makeData from 'data/react-table';
import { GlobalFilter } from 'utils/react-table';
import usePagination from 'hooks/usePagination';

// assets
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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

const MissionCardPage = () => {
  const navigate = useNavigate();
  const data = useMemo(() => makeData(12), []);
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [sortBy, setSortBy] = useState('Id');
  const [globalFilter, setGlobalFilter] = useState('');
  const [missions, setMissions] = useState([]);
  const [page, setPage] = useState(1);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [missionToDelete, setMissionToDelete] = useState(null);
  
  const handleChangeSort = (event) => {
    setSortBy(event.target.value);
  };

  const handleAdd = () => {
    navigate('/missions/new', {
      replace: true
    });
  };

  const handleDeleteAlertClose = () => {
    setOpenDeleteAlert(false);
    setMissionToDelete(null);
  };

  // search
  useEffect(() => {
    const newData = data.filter((value) => {
      if (globalFilter) {
        return value.title.toLowerCase().includes(globalFilter.toLowerCase());
      } else {
        return value;
      }
    });
    setMissions(newData);
  }, [globalFilter, data]);

  const PER_PAGE = 6;

  const count = Math.ceil(missions.length / PER_PAGE);
  const _DATA = usePagination(missions, PER_PAGE);

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
            <GlobalFilter preGlobalFilteredRows={data} globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
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
                Add Mission
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {missions.length > 0 ? (
          _DATA
            .currentData()
            .sort(function (a, b) {
              if (sortBy === 'Title') return a.title.localeCompare(b.title);
              if (sortBy === 'Description') return a.description.localeCompare(b.description);
              return a;
            })
            .map((mission, index) => (
              <Slide key={index} direction="up" in={true} timeout={50}>
                <Grid item xs={12} sm={6} lg={4}>
                  <MissionCard mission={mission} setMissionToDelete={setMissionToDelete} />
                </Grid>
              </Slide>
            ))
        ) : (
          <EmptyMissions title={'You have not created any missions yet.'} />
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

      <AlertMissionDelete title={missionToDelete.title} open={openDeleteAlert} handleClose={handleDeleteAlertClose} />
    </>
  );
};

export default MissionCardPage;
