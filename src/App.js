import { memo, useState, useCallback } from "react";
import hash from "object-hash";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GenericInput from "./Input";
import "./styles.css";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
});

const inputs = [
  {
    value: "password",
    Component: GenericInput,
    initialState: ""
  },
  {
    value: "email",
    Component: GenericInput,
    initialState: "foo@gmail.com"
  }
];

export default function App() {
  const submitAction = (value) => console.log(value);
  return (
    <div className="App">
      <FormContainer
        submitAction={submitAction}
        inputsArray={inputs}
        validationSchema={schema}
      />
    </div>
  );
}

const setInitialState = (array, error) =>
  array.reduce(
    (acc, element) => ({
      ...acc,
      [element.value]: error ? false : element.initialState
    }),
    {}
  );

const FormContainer = memo(
  ({ inputsArray, validationSchema, submitAction }) => {
    const [values, setValues] = useState(setInitialState(inputsArray));
    const [errors, setErrors] = useState(setInitialState(inputsArray, true));

    const onHandleChange = useCallback((fieldName, value) => {
      setValues((prevValues) => ({ ...prevValues, [fieldName]: value }));
    }, []);

    const handleSubmit = useCallback(
      async (event) => {
        event.preventDefault();

        const errorsInitialState = setInitialState(inputsArray, true);
        setErrors(errorsInitialState);

        // Check the schema if form is valid:
        const isFormValid = await validationSchema.isValid(values);

        if (isFormValid) {
          // If form is valid, continue submission.
          submitAction(values);
        } else {
          // If form is not valid, check which fields are incorrect:
          validationSchema
            .validate(values, { abortEarly: false })
            .catch((err) => {
              // Set the error message with the errors we are getting from yup
              err.inner.forEach((error) => {
                setErrors((prevValues) => ({
                  ...prevValues,
                  [error.path]: error.message
                }));
              });
            });
        }
      },
      [values, validationSchema, inputsArray, submitAction]
    );

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap" }}>
        <form onSubmit={handleSubmit} noValidate>
          {inputsArray.map(({ Component, value }) => (
            <Component
              inputName={value}
              onHandleChange={onHandleChange}
              inputValue={values[value]}
              error={errors[value]}
              key={hash(value)}
            />
          ))}
          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>
      </Box>
    );
  }
);

// export default FormContainer;
