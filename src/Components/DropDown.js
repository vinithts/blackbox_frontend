import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import { AiFillCaretDown } from "react-icons/ai";

const DropDown = ({
  value,
  onChange,
  name,
  arr,
  label,
  arrays,
  other,
  values,
  onChanges,
}) => {
  const Arrow = () => {
    return (
      <AiFillCaretDown
        color="white"
        style={{ position: "relative", right: "8px" }}
      />
    );
  };

  const gender = ["Male", "Female"];
  return (
    <>
      {!other ? (
        <div>
          <InputLabel
            id="demo-simple-select-label"
            style={{ color: "gray", fontWeight: "600" }}
          >
            {label}
          </InputLabel>
          <FormControl fullWidth size="medium">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{
                height: "48px",
                borderRadius: "10px",
                border: "1px solid #D9D9D9",
                color: "gray",
              }}
              IconComponent={Arrow}
              name={name}
              value={value}
              onChange={onChange}
            >
              {arr.map((e, i) => (
                <MenuItem key={i} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : (
        <div>
          <InputLabel
            id="demo-simple-select-label"
            style={{ color: "gray", fontWeight: "600" }}
          >
            {label}
          </InputLabel>
          <FormControl fullWidth size="medium">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              style={{
                height: "48px",
                borderRadius: "10px",
                border: "1px solid #D9D9D9",
                color: "gray",
              }}
              IconComponent={Arrow}
              name={name}
              value={values}
              onChange={onChanges}
            >
              {arrays.map((e, i) => (
                <MenuItem key={i} value={e}>
                  {e}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      )}
    </>
  );
};

export default DropDown;
