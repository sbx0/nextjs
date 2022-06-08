import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({open, setOpen, title, columns, data, setData}) {

    const handleClose = () => {
        setOpen(false);
        setData({});
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We
                        will send updates occasionally.
                    </DialogContentText>
                    {
                        columns.map((column, index) => {
                            return <TextField
                                key={column.field + index}
                                autoFocus
                                margin="dense"
                                id="name"
                                label={column.headerName}
                                value={data[column.field]}
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                        })
                    }

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleClose}>Subscribe</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
