import * as yup from 'yup';

// Recovery Code validation
export const RecoveryCodeSchema = yup.object().shape({
  code: yup
    .array()
    .of(yup.string().length(1, 'Each digit must be 1 character'))
    .test('code', 'Invalid recovery code', value => {
      if (!value) {
        return false;
      }
      const concatenatedCode = value.join(''); // Concatenate the digits
      return /^[0-9]{4}$/.test(concatenatedCode);
    })
    .required('Required'),
});
