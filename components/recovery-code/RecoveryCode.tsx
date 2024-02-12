'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { RecoveryCodeSchema } from './code-validation';
import { Button, Input, InputContainer, Text } from '../atomic';
import { Snackbar } from '../atomic/Snackbar/Snackbar';
import { InferType } from 'yup';
import { useForgotPassword, useRecoveryCode } from '@/hooks/auth/auth';
import { useResetStore } from '@/store/auth/useResetStore';

type Code = InferType<typeof RecoveryCodeSchema>;

export const RecoveryCode = () => {
  const { isError, isLoading, mutate: recoveryCode } = useRecoveryCode();

  const { mutate: forgotPassword } = useForgotPassword();

  const { email, otp } = useResetStore();

  const [codeExpiresIn, setCodeExpiresIn] = useState(0);

  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  const [snackContent, setSnackContent] = useState('');

  const handleDigitChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    form: FormikProps<Code>,
    index: number,
  ) => {
    const digit = event.target.value;
    // If the pasted input is a 4-digit code,
    // distribute it across the 4 inputs boxes
    if (/^\d{4}$/.test(digit)) {
      digit.split('').forEach((char, i) => {
        const newIndex = index + i;
        if (newIndex < 4) {
          form.setFieldValue(`code[${newIndex}]`, char);
          if (newIndex < 3 && inputRefs.current[newIndex + 1]) {
            inputRefs.current[newIndex + 1]?.focus();
          }
        }
      });
    } else if (digit.length === 1) {
      // Handle normal input
      form.setFieldValue(`code[${index}]`, digit);
      if (index < 3 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  useEffect(() => {
    setIsSnackbarVisible(true);
    setSnackContent('Invalid code, please try again.');
  }, [isError]);

  const handleBackspace = (
    event: React.KeyboardEvent<HTMLInputElement>,
    form: FormikProps<Code>,
    index: number,
  ) => {
    if (event.key === 'Backspace') {
      form.setFieldValue(`code[${index}]`, '');
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setCanResend(true);
    }, 60000); // 1 minute

    if (otp && otp.emailOtpExpiresAt) {
      const expirationTime = new Date(otp.emailOtpExpiresAt).getTime();
      const currentTime = Date.now();
      const remainingTime = expirationTime - currentTime;

      if (remainingTime > 0) {
        setCodeExpiresIn(Math.floor(remainingTime / 1000));
        const interval = setInterval(() => {
          setCodeExpiresIn(prevSeconds => {
            if (prevSeconds > 0) {
              return prevSeconds - 1;
            }
            clearInterval(interval);
            return 0;
          });
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      }
    }
  }, [otp]);

  const handleResendClick = (resetForm: () => void) => {
    resetForm();

    setIsSnackbarVisible(false);

    if (canResend && codeExpiresIn === 0) {
      forgotPassword({
        email: email,
      });
    } else {
      setIsSnackbarVisible(true);
      setSnackContent(
        `Wait for ${codeExpiresIn} more seconds to request a new code`,
      );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center"></div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-full h-1 p-4 space-y-5">
          {isSnackbarVisible && (
            <Snackbar
              intent="error"
              show={isError}
              snackContent={snackContent}
            />
          )}
          <Formik
            initialValues={{ code: ['', '', '', ''] }}
            onSubmit={(values, { setSubmitting }) => {
              if (!isLoading) {
                try {
                  setSubmitting(false);
                  recoveryCode({
                    code: values.code.join(''),
                    email: email,
                  });
                } catch (error) {
                  setSubmitting(false);
                }
              }
            }}
            validationSchema={RecoveryCodeSchema}
          >
            {({ errors, touched, handleSubmit, resetForm }) => (
              <Form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex-col space-y-3 mb-3">
                  <div className="flex space-x-4">
                    <Field
                      name="code"
                      render={({
                        field,
                        form,
                      }: FieldProps<string[]> & FormikProps<Code>) =>
                        field.value.map((digit: string, index: number) => (
                          <InputContainer key={index}>
                            <Input
                              className="h-12  text-center"
                              key={index}
                              maxLength={1}
                              name={`code[${index}]`}
                              onChange={event => {
                                handleDigitChange(event, form, index);
                              }}
                              onKeyDown={event => {
                                if (['e', 'E', '+', '-'].includes(event.key)) {
                                  event.preventDefault();
                                }
                                handleBackspace(event, form, index);
                              }}
                              ref={input => (inputRefs.current[index] = input)}
                              type="number"
                              value={digit}
                            />
                          </InputContainer>
                        ))
                      }
                    />
                  </div>
                  <Text intent={'red'} size={'sm'}>
                    {errors.code && touched.code && errors.code}
                  </Text>
                </div>
                <Button
                  className="h-12 w-full justify-center mb-80"
                  loading={isLoading}
                  size={'md'}
                  type="submit"
                >
                  Verify code
                </Button>
                <div className="flex flex-col items-center text-center space-y-3">
                  {codeExpiresIn > 0 ? (
                    <Text size={'md'} weight={'semiBold'}>
                      Code expires in{' '}
                      <span className="text-green-500">
                        {Math.floor(codeExpiresIn / 60)
                          .toString()
                          .padStart(2, '0')}
                        :{(codeExpiresIn % 60).toString().padStart(2, '0')}
                      </span>
                    </Text>
                  ) : (
                    <Text size={'md'} weight={'semiBold'}>
                      Code expired
                    </Text>
                  )}

                  <div className="flex space-x-1">
                    <Text size={'md'}>Did not receive code? </Text>
                    <Button
                      className={`${
                        !canResend || codeExpiresIn > 0
                          ? 'cursor-not-allowed text-tints-battleship-grey-tint-1'
                          : 'cursor-pointer'
                      } underline underline-offset-2
                `}
                      intent={'ghost'}
                      loading={isLoading}
                      onClick={() => handleResendClick(resetForm)} // Pass resetForm function
                      size={'ghost'}
                      type="button"
                    >
                      Re-send
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
