'use client';

import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { NewPasswordValidation } from './new-password-validation';
import { Button, Input, InputContainer, Text } from '../atomic';
import Image from 'next/image';
import closeEye from '/public/images/icons/eye-slash.svg';
import openEye from '/public/images/icons/vuesax-linear-eye.svg';
import { Snackbar } from '../atomic/Snackbar/Snackbar';
import { useResetPassword } from '@/hooks/auth/auth';
import { useResetStore } from '@/store/auth/useResetStore';
import { PASSWORD_PLACEHOLDER } from '@/constants/global';

export const NewPassword = () => {
  const { isError, isLoading, mutate: resetPassword } = useResetPassword();

  const { email, code } = useResetStore();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field: string) => {
    if (field === 'newPassword') {
      setShowNewPassword(prevShowPassword => !prevShowPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(prevShowPassword => !prevShowPassword);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center"></div>
      <div className="flex items-center justify-center">
        <div className="w-full h-1 p-4 space-y-5">
          <Snackbar
            intent="error"
            show={isError}
            snackContent={'Set new password failed, please try again'}
          />
          <Formik
            initialValues={{
              newPassword: '',
              confirmPassword: '',
            }}
            onSubmit={(values, { setSubmitting }) => {
              if (!isLoading) {
                try {
                  setSubmitting(false);
                  resetPassword({
                    code: code,
                    email: email,
                    newPassword: values.newPassword,
                  });
                } catch (error) {
                  setSubmitting(false);
                }
              }
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={NewPasswordValidation}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form className="space-y-8" onSubmit={handleSubmit}>
                <div>
                  <div className="flex-col space-y-3 mb-3">
                    <Text size={'md'}>
                      New password<span className="text-red">*</span>
                    </Text>
                    <div className="relative">
                      <InputContainer className="mt-2">
                        <Input
                          className="rounded"
                          containerClassName="w-full"
                          name="newPassword"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder={PASSWORD_PLACEHOLDER}
                          type={showNewPassword ? 'text' : 'password'}
                          value={values.newPassword}
                        />
                        <Button
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          intent={'ghost'}
                          onClick={() =>
                            togglePasswordVisibility('newPassword')
                          }
                          type="button"
                        >
                          {showNewPassword ? (
                            <Image
                              alt="open"
                              height={16}
                              src={openEye}
                              width={16}
                            />
                          ) : (
                            <Image
                              alt="close"
                              height={16}
                              src={closeEye}
                              width={16}
                            />
                          )}
                        </Button>
                      </InputContainer>
                    </div>
                    <Text intent={'red'} size={'sm'}>
                      {errors.newPassword &&
                        touched.newPassword &&
                        errors.newPassword}
                    </Text>
                  </div>
                  <div className="flex-col space-y-3 mt-6">
                    <Text size={'md'}>
                      Confirm new password<span className="text-red">*</span>
                    </Text>
                    <div className="relative">
                      <InputContainer className="mt-2">
                        <Input
                          className="rounded"
                          containerClassName="w-full"
                          name="confirmPassword"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          placeholder={PASSWORD_PLACEHOLDER}
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={values.confirmPassword}
                        />
                        <Button
                          className="absolute inset-y-0 right-0 flex items-center pr-3"
                          intent={'ghost'}
                          onClick={() =>
                            togglePasswordVisibility('confirmPassword')
                          }
                          type="button"
                        >
                          {showConfirmPassword ? (
                            <Image
                              alt="open"
                              height={16}
                              src={openEye}
                              width={16}
                            />
                          ) : (
                            <Image
                              alt="close"
                              height={16}
                              src={closeEye}
                              width={16}
                            />
                          )}
                        </Button>
                      </InputContainer>
                    </div>
                    <Text intent={'red'} size={'sm'}>
                      {errors.confirmPassword &&
                        touched.confirmPassword &&
                        errors.confirmPassword}
                    </Text>
                  </div>
                </div>
                <Button
                  className="h-12 w-full justify-center mb-80"
                  loading={isLoading}
                  size={'md'}
                  type="submit"
                >
                  Save new password
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
