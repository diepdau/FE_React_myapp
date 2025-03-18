import React from "react";
import { Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
};

const StyledCancelButton = styled(Button)({
  borderRadius: "50px",
  backgroundColor: "black",
  textTransform: "none",
  color: "white",
  "&:hover": {
    backgroundColor: "#333",
  },
});

const StyledDeleteButton = styled(Button)({
  borderRadius: "50px",
  textTransform: "none",
});

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
        <StyledDeleteButton onClick={onConfirm} color="error">
          Delete
        </StyledDeleteButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
