import React from "react";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";

const DatePickerComponent = ({ value, onChange, name, label }) => {
  return (
    <div>
      <label style={{ color: "gray", fontWeight: "600", padding: "2px" }}>
        {label}
      </label>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TextField
          type={"date"}
          fullWidth
          sx={{
            border: "1px solid #D9D9D9",
            borderRadius: "10px",
            color: "#D9D9D9",
            height: "45px",
          }}
          size="small"
          InputProps={{
            style: {
              color: "#D9D9D9",
            },
          }}
          name={name}
          value={value}
          onChange={onChange}
        />
      </LocalizationProvider>
    </div>
  );
};

export default DatePickerComponent;
