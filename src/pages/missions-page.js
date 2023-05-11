import PropTypes from 'prop-types';
import { useEffect, useMemo, useState, Fragment } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Button,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  useMediaQuery
} from '@mui/material';

// third-party
import { useFilters, useExpanded, useGlobalFilter, useSortBy, useTable, usePagination } from 'react-table';

// project import
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import IconButton from 'components/@extended/IconButton';
import { PopupTransition } from 'components/@extended/Transitions';
import {
  HeaderSort,
  TablePagination
} from 'components/third-party/ReactTable';

import UpsertMission from 'sections/UpsertMission';
import AlertMissionDelete from 'sections/AlertMissionDelete';

import { renderFilterTypes, GlobalFilter } from 'utils/react-table';

// assets
import { PlusOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { useKeycloak } from '@react-keycloak/web';

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, getHeaderProps, renderRowSubComponent, handleAdd }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'name', desc: false };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    visibleColumns,
    rows,
    page,
    gotoPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize, expanded },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      // @ts-ignore
      filterTypes,
      // @ts-ignore
      initialState: { pageIndex: 0, pageSize: 10, hiddenColumns: ['id', 'avatar'], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns(['id', 'avatar', 'email', 'chamberOfCommerceIdentifier', 'linkedInUrl']);
    } else {
      setHiddenColumns(['id', 'avatar', 'chamberOfCommerceIdentifier']);
    }
    // eslint-disable-next-line
  }, [matchDownSM]);

  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd} size="small">
              Add Mission
            </Button>
          </Stack>
        </Stack>

        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell key={index} {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}>
                    <HeaderSort column={column} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                  >
                    {row.cells.map((cell, index) => (
                      <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns, expanded })}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func,
  renderRowSubComponent: PropTypes.any
};

// ==============================|| MISSION - LIST ||============================== //

const ActionCell = (row, setMission, setMissionToDelete, handleClose, handleAdd, theme) => {
  return (
    <Stack direction="row" spacing={0}>
      <Tooltip title="Edit">
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            setMission(row.values);
            handleAdd();
          }}
        >
          <EditTwoTone twoToneColor={theme.palette.primary.main} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton
          color="error"
          onClick={(e) => {
            e.stopPropagation();
            setMissionToDelete(row.values);
            handleClose();
          }}
        >
          <DeleteTwoTone twoToneColor={theme.palette.error.main} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

const MissionsPage = () => {
  const { keycloak } = useKeycloak();
  const theme = useTheme();

  const bindMissions = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/employers/users/' + encodeURIComponent(keycloak.idTokenParsed.preferred_username) + '/missions',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setData(json.missions);
    } catch (error) {
      console.log(error);
    }
  }

  const [data, setData] = useState([]);
  const [add, setAdd] = useState(false);
  const [open, setOpen] = useState(false);
  const [mission, setMission] = useState();
  const [missionToDelete, setMissionToDelete] = useState();

  useEffect(() => {
    (async () => {
      await bindMissions();
    })();
  }, []);

  const handleAdd = () => {
    setAdd(!add);
    if (mission && !add) setMission(null);
  };

  const handleClose = () => {
    setOpen(!open);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Actions',
        disableSortBy: true,
        className: 'cell-actions',
        Cell: ({ row }) => ActionCell(row, setMission, setMissionToDelete, handleClose, handleAdd, theme)
      },
      {
        Header: '#',
        accessor: 'id',
        className: 'cell-center',
        disableSortBy: true
      },
      {
        Header: 'Title',
        accessor: 'title',
        className: 'cell-nowrap'
      },
      {
        Header: 'Description',
        accessor: 'description'
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={data}
          handleAdd={handleAdd}
          getHeaderProps={(column) => column.getSortByToggleProps()}
        />
      </ScrollX>
      <AlertMissionDelete mission={missionToDelete} open={open} handleClose={handleClose} bindMissions={bindMissions} />
      {/* add user dialog */}
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={handleAdd}
        open={add}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <UpsertMission mission={mission} onCancel={handleAdd} bindMissions={bindMissions} />
      </Dialog>
    </MainCard>
  );
};

export default MissionsPage;
