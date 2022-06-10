import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({open, setOpen, title, dialogContent, dialogActions}) {

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {dialogContent}
            </DialogContent>
            <DialogActions>
                {dialogActions}
            </DialogActions>
        </Dialog>
    );
}
