import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({open, setOpen, title, dialogContent, dialogActions, fullScreen}) {

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullScreen={fullScreen}>
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
