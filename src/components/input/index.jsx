import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

import DateInput from "./DateInput";

const Input = ({
  label,
  value,
  type = "TEXT",
  handleChange,
  helpers,
  required,
  isErrored,
  options,
  disabled,
  backgroundColor,
  color,
  disableClearable,
  renderOption,
  groupBy,
  maxDate,
  minDate,
  labelEnd,
}) => {
  const renderField = () => {
    if (options) {
      const selected = options.find((option) => option.value === value);
      return (
        <Autocomplete
          sx={{
            div: {
              backgroundColor: backgroundColor ? backgroundColor : "none",
              color: color ? color : "inherit",
            },
            input: {
              "text-fill-color": color ? color : "inherit",
              color: color ? color : "inherit",
            },
          }}
          disableClearable={disableClearable}
          renderOption={renderOption}
          groupBy={groupBy}
          value={selected ? selected : null}
          disabled={disabled}
          onChange={(_, value) => {
            handleChange(value ? value.value : "");
          }}
          isOptionEqualToValue={(option, value) => {
            return value ? option.value === value.value : false;
          }}
          size="small"
          fullWidth
          autoComplete={false}
          options={options}
          renderInput={(params) => <TextField {...params} />}
        />
      );
    }
    switch (type) {
      case "TEXT":
        return (
          <TextField
            sx={{
              input: {
                backgroundColor: backgroundColor ? backgroundColor : "none",
                color: color ? color : "inherit",
              },
            }}
            size="small"
            fullWidth
            disabled={disabled}
            value={value}
            onChange={(event) => {
              handleChange(event.target.value);
            }}
          />
        );
      case "LONG_TEXT":
        return (
          <TextField
            sx={{
              input: {
                backgroundColor: backgroundColor ? backgroundColor : "none",
                color: color ? color : "inherit",
              },
            }}
            size="small"
            multiline
            rows={4}
            fullWidth
            disabled={disabled}
            value={value}
            onChange={(event) => {
              handleChange(event.target.value);
            }}
          />
        );
      case "DATE":
        return (
          <DateInput
            handleChange={handleChange}
            value={value}
            maxDate={maxDate}
            minDate={minDate}
            disabled={disabled}
          />
        );
      case "BOOLEAN":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={value}
                onChange={(event) => {
                  handleChange(event.target.checked);
                }}
              />
            }
            label={labelEnd}
          />
        );

      default:
        break;
    }
  };
  return (
    <Box sx={{ width: "100%" }}>
      {label && (
        <Typography sx={{ fontWeight: "bold", color: isErrored && "red" }}>
          {label}
          {required && (
            <Typography variant="mandatoryStar">&nbsp;&lowast;</Typography>
          )}
        </Typography>
      )}
      {renderField()}
      {helpers &&
        helpers.map((h) => {
          return (
            <Box>
              <Typography sx={{ color: "red", fontSize: "13px" }}>
                {h}
              </Typography>
            </Box>
          );
        })}
    </Box>
  );
};

export default Input;
