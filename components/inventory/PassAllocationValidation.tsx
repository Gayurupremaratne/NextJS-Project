import * as yup from 'yup';

export const passAllocationValidation = yup.object().shape({
  selectedDateRange: yup.object().shape({
    startDate: yup.date().required('Date is required'),
    endDate: yup.date().required('Date is required'),
  }),
  passCount: yup
    .number()
    .min(0, 'Minimum pass count is 0')
    .max(20000, 'Maximum pass count is 20000')
    .required('Number of passes required'),
  confirmClose: yup
    .boolean()
    .required('stage closure confirmation is required'),
  reason: yup
    .string()
    .test('reason', 'Reason can not be empty', function (value) {
      const confirmation = this.parent.confirmClose;
      if (confirmation) {
        if (!value || value.length < 0) {
          return this.createError({
            path: 'reason',
            message: 'Reason can not be empty',
          });
        }
      }
      return true;
    }),
});
