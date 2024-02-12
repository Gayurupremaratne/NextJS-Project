import * as yup from 'yup';

//login form validation
export const formValidation = yup.object().shape({
  email: yup.string().trim().required('Please enter email'),
});
