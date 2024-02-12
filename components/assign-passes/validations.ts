import * as yup from 'yup';

// assign pass form validation
export const assignPassValidation = yup.object().shape({
  reservedFor: yup.string().required('Please select a date'),
  userId: yup.string().required('Please select a user'),
  passCount: yup.object().shape({
    adults: yup
      .number()
      .min(0, 'Pass count cannot be less than 0')
      .required('Please enter a pass count'),
    children: yup
      .number()
      .min(0, 'Pass count cannot be less than 0')
      .required('Please enter a pass count'),
  }),
});
