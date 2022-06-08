import * as React from 'react';
import {useEffect, useState} from 'react';
import {DataGrid, GridActionsCellItem} from '@mui/x-data-grid';
import {gameAdminRoomsApi} from "../../apis/gameAdmin";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FormDialog from "../../components/dialog/FormDialog";

export default function DataTable() {
    const columns = [
        {field: 'id', headerName: 'ID', width: 80},
        {field: 'roomCode', headerName: 'Room Code', width: 280},
        {field: 'roomName', headerName: 'Room Name', width: 200},
        {
            field: 'playersSize',
            headerName: 'Size',
            type: 'number',
            width: 90,
            valueGetter: (params) =>
                `${params.row.playersInSize || '0'} / ${params.row.playersSize || '0'}`
        },
        {
            field: 'roomStatus',
            headerName: 'Room Status',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 160,
        },
        {
            field: 'publicFlag',
            headerName: 'Public Flag',
            sortable: false,
            width: 160,
        },
        {
            field: 'remark',
            headerName: 'Remark',
            sortable: false,
            width: 160,
        },
        {
            field: 'createTime',
            headerName: 'Create Time',
            width: 160,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
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
        },
    ];
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowData, setRowData] = useState({});

    const handleSaveClick = (rowData) => {
        setRowData(rowData);
        setOpen(true);
    }

    const handleDeleteClick = () => {

    }

    useEffect(() => {
        gameAdminRoomsApi({keyword: ''}).then((r) => {
            console.log(r);
            if (r.code === '0') {
                setRows(r.data);
            }
        })
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
