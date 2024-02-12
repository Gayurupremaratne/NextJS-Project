'use client';

import React from 'react';
import { Form, Formik } from 'formik';
import { formValidation } from './form-validation';
import { Button, Input, InputContainer, Text } from '../atomic';
import { Snackbar } from '../atomic/Snackbar/Snackbar';
import { useDeleteAccountRequest } from '@/hooks/delete-account/delete-account';

export const DeleteAccountRequestForm = () => {
  const {
    isError,
    isLoading,
    mutate: deleteRequest,
  } = useDeleteAccountRequest();

  return (
    <div>
      <div className="flex items-center justify-center"></div>
      <div className="flex items-center justify-center">
        <div className="w-full h-1 p-4 space-y-5">
          <Snackbar
            intent="error"
            show={isError}
            snackContent={'Account deletion request failed, please try again.'}
          />
          <Formik
            initialValues={{ email: '' }}
            onSubmit={(values, { setSubmitting }) => {
              if (!isLoading) {
                try {
                  setSubmitting(false);
                  deleteRequest({
                    email: values.email,
                  });
                } catch (error) {
                  setSubmitting(false);
                }
              }
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={formValidation}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
              <Form className="space-y-5" onSubmit={handleSubmit}>
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
                  <Text intent={'red'} size={'sm'}>
                    {errors.email && touched.email && errors.email}
                  </Text>
                </div>
                <Button
                  className="flex h-12 w-full justify-center mb-80"
                  loading={isLoading}
                  size={'md'}
                  type="submit"
                >
                  Send verification email
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
