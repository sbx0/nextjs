import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from "../../components/dialog/FormDialog";
import {
    homeCommunitiesApi,
    homeCommunityAddOneApi,
    homeCommunityTableStructureApi,
    homeCommunityUpdateOneByIdApi
} from "../../apis/home";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {MobileDatePicker} from '@mui/x-date-pickers/MobileDatePicker';
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import moment from "moment";

export default function DataTable() {
    const moreProperties = {
        id: {
            hideList: false,
            hideDetail: true,
            hideSave: true,
            hideEdit: true
        },
        communityName: {
            width: 300
        },
        communityAddress: {
            hideList: true,
            width: 250
        },
        property: {
            width: 250
        },
        developer: {
            width: 250
        },
        createTime: {
            width: 150,
            hideList: false,
            hideDetail: false,
            hideSave: true,
            hideEdit: true
        },
        updateTime: {
            width: 150,
            hideList: false,
            hideDetail: false,
            hideSave: true,
            hideEdit: true
        },
        delFlag: {
            hideList: true,
            hideDetail: true,
            hideSave: true,
            hideEdit: true
        }
    }
    const [columns, setColumns] = useState([]);
    const [listColumns, setListColumns] = useState([]);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowData, setRowData] = useState({});
    const [sortModel, setSortModel] = useState([{
        field: 'id',
        sort: 'desc',
    }]);
    const [formData, setFormData] = useState({});
    const [dialogType, setDialogType] = useState('add');

    // load table structure and build table
    useEffect(() => {
        homeCommunityTableStructureApi().then((r) => {
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
                    newColumns.push(newColumn);
                }
                setColumns(newColumns);

                let newListColumns = [];
                for (let i = 0; i < newColumns.length; i++) {
                    if (newColumns[i].hideList) {
                        continue;
                    }
                    newListColumns.push(newColumns[i]);
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
                getList({keyword: '', sorts: sortModel})
            }
        })
    }, []);

    // handle order click
    useEffect(() => {
        getList({keyword: '', sorts: sortModel})
    }, [sortModel]);

    // load list data
    const getList = (params) => {
        homeCommunitiesApi(params).then((r) => {
            if (r.code === '0') {
                setRows(r.data);
            }
        });
    }

    const handleAddActionClick = () => {
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
            homeCommunityUpdateOneByIdApi(newFormData).then((r) => {
                if (r.code === '0') {
                    getList({keyword: '', sorts: sortModel});
                }
            })
        } else {
            homeCommunityAddOneApi(newFormData).then((r) => {
                if (r.code === '0') {
                    getList({keyword: '', sorts: sortModel});
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

    const handleDeleteActionClick = () => {

    }

    const formatToHump = (value) => {
        return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
    }

    return (
        <div style={{height: 400, width: '100%'}}>
            <Button variant="outlined" onClick={() => handleAddActionClick()}>
                新增
            </Button>
            <DataGrid
                rows={rows}
                columns={listColumns}
                pageSize={5}
                rowsPerPageOptions={[5]}
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

    if (dialogType === 'edit') {
        if (column.hideEdit || column.field === 'actions') {
            return null;
        }
    } else {
        if (column.hideSave || column.field === 'actions') {
            return null;
        }
    }

    if (column.columnType.toString().indexOf('varchar') !== -1) {
        return <TextField
            autoFocus
            margin="dense"
            id="name"
            label={column.headerName}
            defaultValue={formData[column.field]}
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => handleChange(column.field, event.target.value)}
        />;
    } else if (column.columnType.toString().indexOf('decimal') !== -1
        || column.columnType.toString().indexOf('int') !== -1) {
        return <TextField
            autoFocus
            margin="dense"
            id="name"
            label={column.headerName}
            defaultValue={formData[column.field]}
            type="number"
            fullWidth
            variant="standard"
            onChange={(event) => handleChange(column.field, event.target.value)}
        />;
    } else if (column.columnType.toString().indexOf('year') !== -1) {
        return <MobileDatePicker
            label={column.headerName}
            inputFormat="yyyy"
            value={formData[column.field]}
            onChange={(data) => handleChange(column.field, data)}
            renderInput={(params) => <TextField
                key={column.field}
                margin="dense"
                fullWidth
                variant="standard"
                {...params}
            />}/>;
    } else if (column.columnType.toString().indexOf('datetime') !== -1) {
        return <MobileDatePicker
            label={column.headerName}
            inputFormat="yyyy-MM-dd"
            value={formData[column.field]}
            onChange={(data) => handleChange(column.field, data)}
            renderInput={(params) => <TextField
                key={column.field}
                margin="dense"
                fullWidth
                variant="standard"
                {...params}
            />}/>;
    } else {
        return <p key={column.field}>{column.field} {column.columnType}</p>
    }
}
