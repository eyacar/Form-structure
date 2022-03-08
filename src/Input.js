import { memo, useCallback } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";

const GenericInput = memo(
  ({ onHandleChange, inputName, inputValue, error }) => {
    const inputHandleChange = useCallback(
      (event) => {
        onHandleChange(inputName, event.target.value);
      },
      [onHandleChange, inputName]
    );

    const isError = Boolean(error);

    const label =
      inputName[0].toUpperCase() +
      inputName.slice(1, inputName.length).toLowerCase();

    return (
      <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
        <InputLabel error={isError} htmlFor={`outlined-${inputName}`}>
          {label}
        </InputLabel>
        <OutlinedInput
          id={`outlined-${inputName}`}
          name={inputName}
          label={inputName}
          value={inputValue}
          onChange={inputHandleChange}
          error={isError}
        />
        {isError && (
          <FormHelperText error id="filled-weight-helper-text">
            {error}
          </FormHelperText>
        )}
      </FormControl>
    );
  }
);

export default GenericInput;
