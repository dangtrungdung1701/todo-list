import { useState } from "react";
import { TextField, Button, Popover } from "@mui/material";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";

import "react-day-picker/dist/style.css";

const { VITE_DATE_FORMAT = "yyyy-MM-dd" } = import.meta.env;

const DateInput = ({
  handleChange,
  value,
  maxDate,
  minDate,
  disabled,
  backgroundColor,
}) => {
  const currentYear = new Date().getFullYear();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  return (
    <>
      <TextField
        onClick={(event) => {
          !disabled && setAnchorEl(event.currentTarget);
        }}
        sx={{
          input: {
            backgroundColor: backgroundColor ? backgroundColor : "none",
          },
        }}
        size="small"
        fullWidth
        disabled={disabled}
        value={
          value
            ? VITE_DATE_FORMAT
              ? format(new Date(value), VITE_DATE_FORMAT)
              : value
            : ""
        }
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <DayPicker
            selected={value ? new Date(value) : null}
            mode="single"
            disabled={[
              { after: maxDate ? new Date(maxDate) : null },
              { before: minDate ? new Date(minDate) : null },
            ]}
            fromYear={1900}
            toYear={currentYear}
            captionLayout="dropdown"
            onSelect={(value) => {
              handleChange(value ? format(value, VITE_DATE_FORMAT) : "");
              handleClose();
            }}
          />
          <div style={{ padding: 5 }}>
            <Button
              style={{ marginRight: 5 }}
              variant="contained"
              onClick={() => {
                handleChange("");
                handleClose();
              }}
            >
              Clear
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default DateInput;
