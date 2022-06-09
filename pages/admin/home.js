import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from "../../components/dialog/FormDialog";
import {homeCommunitiesApi, homeCommunityTableStructureApi} from "../../apis/home";

export default function DataTable() {
    const actionColumns = {
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
                    onClick={() => handleSaveClick(row)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon/>}
                    label="Delete"
                    onClick={() => handleDeleteClick(id)}
                    color="inherit"
                />,
            ];
        },
    };
    const [columns, setColumns] = useState([]);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowData, setRowData] = useState({});

    const handleSaveClick = (rowData) => {
        setRowData(rowData);
        setOpen(true);
    }

    const handleDeleteClick = () => {

    }

    const formatToHump = (value) => {
        return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase())
    }

    const autoWidth = (column) => {
        if (column === 'communityName') {
            return 300;
        } else if (column === 'communityAddress') {
            return 250;
        } else if (column === 'property') {
            return 250;
        } else if (column === 'developer') {
            return 250;
        } else if (column === 'createTime' || column === 'updateTime') {
            return 150;
        } else {
            return 80;
        }
    }

    const autoHide = (column) => {
        if (column === 'delFlag') {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        homeCommunityTableStructureApi().then((r) => {
            if (r.code === '0') {
                let newColumns = [];
                let tableColumns = r.data.columns;
                for (let i = 0; i < tableColumns.length; i++) {
                    let key = formatToHump(tableColumns[i]['columnName']);
                    if (autoHide(key)) {
                        continue;
                    }
                    let newColumn = {};
                    newColumn.field = key;
                    newColumn.headerName = tableColumns[i]['columnComment'];
                    newColumn.width = autoWidth(key);
                    newColumns.push(newColumn);
                }
                newColumns.push(actionColumns);
                setColumns(newColumns);
            }
        })
        homeCommunitiesApi({keyword: ''}).then((r) => {
            if (r.code === '0') {
                setRows(r.data);
            }
        });
    }, [])

    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
            />
            <FormDialog open={open} setOpen={setOpen}
                        title={'Change'}
                        data={rowData}
                        columns={columns}
                        setData={setRowData}/>
        </div>
    );
}
