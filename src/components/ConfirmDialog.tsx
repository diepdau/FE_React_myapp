import React from "react";
import { Dialog, DialogActions, DialogTitle, Button, DialogContent ,Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { styled } from "@mui/material/styles";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
};

const StyledCancelButton = styled(Button)({
  borderRadius: "12px",
  backgroundColor: "black",
  textTransform: "none", padding: "10px", 
  minWidth: "120px",
  color: "white",
  "&:hover": {
    backgroundColor: "#333",
  },
});

const StyledDeleteButton = styled(Button)({
  borderRadius: "12px",
  textTransform: "none", border: "1px solid red",  padding: "10px", 
  minWidth: "120px",
  color: "red",
  "&:hover": {
    backgroundColor: "rgba(255, 0, 0, 0.1)",
  },
});

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,description,
}) => {
  return (
    <div className="p-3">
      <Dialog open={open} onClose={onClose}>
      <DialogTitle   sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold", fontSize: "1.5rem" }}
        >{title}</DialogTitle>
        {description && (
          <DialogContent sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningAmberIcon sx={{ color: "red", fontSize: 40  }} />
            <Typography>{description}</Typography>
          </DialogContent>
        )}
        <DialogActions>
          <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
          <StyledDeleteButton onClick={onConfirm} color="error">
            Delete
          </StyledDeleteButton>
        </DialogActions>
      </Dialog>
    </div>
   
  );
};

export default ConfirmDialog;
