'use client';

import React, { useState } from 'react';
import { Form, Formik } from 'formik';
import { loginValidation } from './login-form-validation';
import { Button, Input, InputContainer, Text } from '../atomic';
import Link from 'next/link';
import Image from 'next/image';
import closeEye from '/public/images/icons/eye-slash.svg';
import openEye from '/public/images/icons/vuesax-linear-eye.svg';
import { useLoginUser } from '@/hooks/auth/auth';
import { Snackbar } from '../atomic/Snackbar/Snackbar';
import { PASSWORD_PLACEHOLDER } from '@/constants/global';
import ErrorText from './ErrorText';
import { isAxiosError } from 'axios';

const LoginForm = () => {
  const { isError, isLoading, mutateAsync: login, error } = useLoginUser();
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };
  const [isAdminErrorExist, setIsAdminErrorExist] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-center"></div>
      <div className="flex items-center justify-center">
        <div className="w-full h-1 p-4 space-y-5">
          <Snackbar
            intent="error"
            show={isError || isAdminErrorExist}
            snackContent={
              isAxiosError(error)
                ? error.response?.data.message
                : 'Login failed, please try again'
            }
          />
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(false);
              setIsAdminErrorExist(false);
              const isAdmin = await login(values);
              if (!isAdmin) {
                setIsAdminErrorExist(true);
              }
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={loginValidation}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="flex-col space-y-3 mb-3">
                  <Text size={'md'}>
                    Email address<span className="text-red">*</span>
                  </Text>
                  <InputContainer className="mt-2">
                    <Input
                      className="rounded"
                      containerClassName="w-full"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="johndoe@gmail.com"
                      type="email"
                      value={values.email}
                    />
                  </InputContainer>
                  <ErrorText>
                    {errors.email && touched.email && errors.email}
                  </ErrorText>
                </div>
                <div className="flex-col space-y-3 mt-6">
                  <Text size={'md'}>
                    Password<span className="text-red">*</span>
                  </Text>
                  <div className="relative">
                    <InputContainer className="mt-2">
                      <Input
                        className="rounded"
                        containerClassName="w-full"
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder={PASSWORD_PLACEHOLDER}
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                      />
                      <Button
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        intent={'ghost'}
                        onClick={togglePasswordVisibility}
                        type="button"
                      >
                        {showPassword ? (
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
                  <ErrorText>
                    {errors.password && touched.password && errors.password}
                  </ErrorText>
                </div>
                <div className="flex items-center justify-center mt-6 mb-8">
                  <Link href="/forgot-password">
                    <Text
                      className="underline"
                      intent={'green'}
                      size={'md'}
                      weight={'semiBold'}
                    >
                      Forgot password
                    </Text>
                  </Link>
                </div>
                <Button
                  className="h-12 w-full justify-center mb-80"
                  loading={isLoading}
                  size={'md'}
                  type="submit"
                >
                  Login
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
