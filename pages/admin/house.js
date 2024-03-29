import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from "../../components/dialog/FormDialog";
import {
    homeCommunityHouseAddOneApi,
    homeCommunityHouseApi,
    homeCommunityHouseTableStructureApi,
    homeCommunityHouseUpdateOneByIdApi
} from "../../apis/house";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {MobileDatePicker} from '@mui/x-date-pickers/MobileDatePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import moment from "moment";
import {MenuItem, Rating, Typography} from "@mui/material";
import CommunityAutocomplete from "../../components/select/CommunityAutocomplete";

export default function DataTable() {
    const moreProperties = {
        id: {
            hideList: true,
            hideDetail: true,
            hideSave: true,
            hideEdit: true,
            order: 1
        },
        houseName: {
            width: 150,
            order: 2
        },
        communityId: {
            width: 150,
            order: 2.5,
            hideList: true,
            columnType: 'CommunityAutocomplete'
        },
        communityName: {
            width: 150,
            order: 3,
            hideSave: true,
            hideEdit: true
        },
        decorationType: {
            width: 150,
            order: 4
        },
        housePrice: {
            width: 150,
            order: 5
        },
        houseSize: {
            width: 150,
            order: 6
        },
        firstPay: {
            width: 150,
            order: 7
        },
        subjectiveRating: {
            order: 3.2,
            width: 140,
            columnType: 'rating',
            renderCell: (params) => {
                return <Rating value={params.row.subjectiveRating} readOnly/>
            }
        },
        objectiveRating: {
            order: 3.3,
            hideList: true,
            hideSave: true,
            hideEdit: true
        },
        remark: {
            hideList: true,
            order: 16,
        },
        createTime: {
            width: 150,
            hideList: true,
            hideDetail: false,
            hideSave: true,
            hideEdit: true,
            order: 17
        },
        updateTime: {
            width: 150,
            hideList: true,
            hideDetail: false,
            hideSave: true,
            hideEdit: true,
            order: 18
        },
        delFlag: {
            hideList: true,
            hideDetail: true,
            hideSave: true,
            hideEdit: true,
            order: 19
        },
    }
    const [columns, setColumns] = useState([]);
    const [listColumns, setListColumns] = useState([]);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowData, setRowData] = useState({});
    const [sortModel, setSortModel] = useState([]);
    const [formData, setFormData] = useState({});
    const [dialogType, setDialogType] = useState('add');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [mapOpen, setMapOpen] = useState(false);

    // load table structure and build table
    useEffect(() => {
        homeCommunityHouseTableStructureApi().then((r) => {
            if (r.code === '0') {
                let newColumns = [];
                let tableColumns = r.data.columns;
                for (let i = 0; i < tableColumns.length; i++) {
                    let key = formatToHump(tableColumns[i]['columnName']);
                    let newColumn = {};
                    newColumn.field = key;
                    newColumn.headerName = tableColumns[i]['columnComment'];
                    newColumn.columnType = tableColumns[i]['columnType'];
                    newColumn = {
                        ...newColumn,
                        ...moreProperties[key]
                    }
                    if (newColumn.order === undefined) {
                        newColumn.order = 9999;
                    }
                    newColumns.push(newColumn);
                }

                for (let i = 0; i < newColumns.length; i++) {
                    for (let j = 0; j < (newColumns.length - i - 1); j++) {
                        if (newColumns[j].order > newColumns[j + 1].order) {
                            let temp = newColumns[j];
                            newColumns[j] = newColumns[j + 1];
                            newColumns[j + 1] = temp;
                        }
                    }
                }

                setColumns(newColumns);

                let newListColumns = [];
                for (let i = 0; i < newColumns.length; i++) {
                    if (newColumns[i].hideList) {
                        continue;
                    }
                    newListColumns.push(newColumns[i]);
                }

                for (let i = 0; i < newListColumns.length; i++) {
                    for (let j = 0; j < (newListColumns.length - i - 1); j++) {
                        if (newListColumns[j].order > newListColumns[j + 1].order) {
                            let temp = newListColumns[j];
                            newListColumns[j] = newListColumns[j + 1];
                            newListColumns[j + 1] = temp;
                        }
                    }
                }

                newListColumns.push({
                    field: 'actions',
                    type: 'actions',
                    headerName: '操作',
                    width: 100,
                    cellClassName: 'actions',
                    getActions: ({row}) => {
                        return [
                            <GridActionsCellItem
                                icon={<EditIcon/>}
                                label="Edit"
                                className="textPrimary"
                                onClick={() => handleEditActionClick(row)}
                                color="inherit"
                            />,
                            <GridActionsCellItem
                                icon={<DeleteIcon/>}
                                label="Delete"
                                onClick={() => handleDeleteActionClick(row)}
                                color="inherit"
                            />,
                        ];
                    },
                });
                setListColumns(newListColumns);
                getList({keyword: '', orders: sortModel, page: page, size: size})
            }
        })
    }, []);

    // handle order click
    useEffect(() => {
        getList({keyword: '', orders: sortModel, page: page, size: size})
    }, [sortModel, page, size]);

    // load list data
    const getList = (params) => {
        let p = {...params};
        p.page = page + 1;
        homeCommunityHouseApi(p).then((r) => {
            if (r.code === '0') {
                setRows(r.data);
                setTotal(r.total)
            }
        });
    }

    const handleAddActionClick = () => {
        setRowData({});
        setFormData({});
        setDialogType('add')
        setOpen(true);
    }

    const handleEditActionClick = (rowData) => {
        setDialogType('edit')
        setRowData(rowData);
        setFormData(rowData);
        setOpen(true);
    }

    const handleDialogClose = () => {
        setOpen(false);
        setRowData({});

        let newFormData = {...handleDate(formData)};

        if (dialogType === 'edit') {
            homeCommunityHouseUpdateOneByIdApi(newFormData).then((r) => {
                if (r.code === '0') {
                    getList({keyword: '', orders: sortModel, page: page, size: size});
                }
            })
        } else {
            homeCommunityHouseAddOneApi(newFormData).then((r) => {
                if (r.code === '0') {
                    getList({keyword: '', orders: sortModel, page: page, size: size});
                }
            })
        }
    }

    const handleDate = (formData) => {
        let newFormData = {...formData};
        console.log(moment(newFormData.buildingAge).format('yyyy'))
        newFormData.buildingAge = moment(newFormData.buildingAge).format('yyyy');
        return newFormData;
    }

    const handleDialogCancel = () => {
        setOpen(false);
        setRowData({});
    }

    const handleMapDialogCancel = () => {
        setMapOpen(false);
        setRowData({});
    }

    const handleDeleteActionClick = () => {

    }

    const handleMapActionClick = (rowData) => {
        setRowData(rowData);
        setFormData(rowData);
        setMapOpen(true);
    }

    const formatToHump = (value) => {
        return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
    }

    return (
        <div style={{height: '631px', width: '100%'}}>
            <Button variant="outlined" onClick={() => handleAddActionClick()}>
                新增
            </Button>
            <DataGrid
                rows={rows}
                rowCount={total}
                columns={listColumns}
                pagination
                paginationMode="server"
                page={page}
                onPageChange={(newPage) => setPage(newPage)}
                pageSize={size}
                rowsPerPageOptions={[10, 20, 50, 100]}
                onPageSizeChange={(newSize) => setSize(newSize)}
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={(newSortModel) => setSortModel(newSortModel)}
            />
            <FormDialog open={open} setOpen={setOpen}
                        title={dialogType}
                        dialogContent={<BuildForm columns={columns}
                                                  dialogType={dialogType}
                                                  formData={formData}
                                                  setFormData={setFormData}/>}
                        dialogActions={<>
                            <Button onClick={handleDialogCancel}>取消</Button>
                            <Button onClick={handleDialogClose}>提交</Button>
                        </>}/>
        </div>
    );
}


function BuildForm({columns, formData, setFormData, dialogType}) {

    const handleChange = (field, value) => {
        let newFormData = {...formData};
        newFormData[field] = value;
        setFormData(newFormData);
    };

    return <LocalizationProvider dateAdapter={AdapterDateFns}>
        {
            columns.map((column, index) =>
                <BuildField key={column.field + index}
                            column={column}
                            dialogType={dialogType}
                            handleChange={handleChange}
                            formData={formData}/>)
        }
    </LocalizationProvider>
}

function BuildField({column, handleChange, formData, dialogType}) {
    let data = {...formData};
    data.buildingAge = moment(data.buildingAge, 'yyyy');

    if (dialogType === 'edit') {
        if (column.hideEdit || column.field === 'actions') {
            return null;
        }
    } else {
        if (column.hideSave || column.field === 'actions') {
            return null;
        }
    }

    if (column.columnType.toString().indexOf('CommunityAutocomplete') !== -1) {
        return <CommunityAutocomplete label={column.headerName}/>;
    } else if (column.columnType.toString().indexOf('rating') !== -1) {
        return <>
            <Typography component="legend">{column.headerName}</Typography>
            <Rating name={column.field}
                    value={data[column.field]}
                    onChange={(event, newValue) => handleChange(column.field, newValue)}/>
        </>
    } else if (column.columnType.toString().indexOf('select') !== -1) {
        return <>
            <TextField
                select
                margin="dense"
                value={data[column.field]}
                onChange={(event) => handleChange(column.field, event.target.value)}
                fullWidth
                label={column.headerName}
            >
                {column.selectOptions.map((option) => {
                    return <MenuItem key={option.key} value={option.value}>{option.label}</MenuItem>
                })}
            </TextField>
        </>
    } else if (column.columnType.toString().indexOf('varchar') !== -1) {
        return <TextField
            id={column.headerName}
            label={column.headerName}
            margin="dense"
            defaultValue={data[column.field]}
            type="text"
            fullWidth
            onChange={(event) => handleChange(column.field, event.target.value)}
        />;
    } else if (column.columnType.toString().indexOf('decimal') !== -1
        || column.columnType.toString().indexOf('int') !== -1) {
        return <TextField
            margin="dense"
            id="name"
            label={column.headerName}
            defaultValue={data[column.field]}
            type="number"
            fullWidth
            onChange={(event) => handleChange(column.field, event.target.value)}
        />;
    } else if (column.columnType.toString().indexOf('year') !== -1) {
        return <MobileDatePicker
            label={column.headerName}
            inputFormat="yyyy"
            value={data[column.field]}
            onChange={(data) => handleChange(column.field, data)}
            renderInput={(params) => <TextField
                key={column.field}
                margin="dense"
                fullWidth
                {...params}
            />}/>;
    } else if (column.columnType.toString().indexOf('datetime') !== -1) {
        return <MobileDatePicker
            label={column.headerName}
            inputFormat="yyyy-MM-dd"
            value={data[column.field]}
            onChange={(data) => handleChange(column.field, data)}
            renderInput={(params) => <TextField
                key={column.field}
                margin="dense"
                fullWidth
                {...params}
            />}/>;
    } else {
        return <p key={column.field}>{column.field} {column.columnType}</p>
    }
}
