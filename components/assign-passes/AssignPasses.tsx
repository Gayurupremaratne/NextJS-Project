'use client';

import {
  AutoSuggest,
  Button,
  Input,
  InputContainer,
  Item,
  Text,
} from '@/components/atomic';
import { useGetInventoriesAllocationByMonth } from '@/hooks/inventory/inventory';
import { useCreateOrder } from '@/hooks/order/order';
import { useGetUsersByEmail } from '@/hooks/user/user';
import { CreateOrderPayload } from '@/types/order/order.type';
import { useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { DateRange } from '../atomic/DateRange';
import { DateValueType, MonthYearType } from '../atomic/DateRange/types';
import { Snackbar, SnackbarProps } from '../atomic/Snackbar/Snackbar';
import { assignPassValidation } from './validations';

interface Props {
  stageId: string;
  setShowAssignPassDialog: (value: boolean) => void;
}

const AssignPasses = ({ stageId, setShowAssignPassDialog }: Props) => {
  const [date, setDate] = useState<DateValueType>({
    startDate: '',
    endDate: '',
  });

  const [email, setEmail] = useState<string>('');

  const [monthYear, setMonthYear] = useState<MonthYearType>();

  const [showMessage, setShowMessage] = useState<SnackbarProps>({
    show: false,
    snackContent: '',
    intent: undefined,
  });

  const { data: disableDates } = useGetInventoriesAllocationByMonth({
    stageId: stageId,
    month: monthYear?.month.toString() || '',
    year: monthYear?.year.toString() || '',
  });

  const { data: users } = useGetUsersByEmail(email);

  const queryClient = useQueryClient();

  const { mutateAsync: createOrder } = useCreateOrder();

  const onSubmit = async (
    values: Omit<CreateOrderPayload, 'stageId'>,
    resetForm: () => void,
  ) => {
    try {
      const response = await createOrder({
        ...values,
        stageId: stageId,
      });

      if (response.statusCode == 201) {
        setShowMessage({
          show: true,
          snackContent: 'Order successful!',
          intent: 'success',
        });

        queryClient.invalidateQueries([
          'get-inventories-by-month',
          stageId,
          monthYear?.month.toString(),
          monthYear?.year.toString(),
        ]);

        queryClient.invalidateQueries([
          'get-inventory-allocation',
          stageId,
          monthYear?.month.toString(),
          monthYear?.year.toString(),
        ]);

        resetForm();
        setDate({ startDate: null, endDate: null });
        setEmail('');
        setShowAssignPassDialog(false);
      } else {
        setShowMessage({
          show: true,
          snackContent: 'Order falied! Please try again.',
          intent: 'error',
        });
      }
    } catch (error) {
      setShowMessage({
        show: true,
        snackContent: isAxiosError(error)
          ? error.response?.data.message
          : 'Order falied! Please try again.',
        intent: 'error',
      });
    }
  };

  return (
    <>
      <div className="my-4">
        <Snackbar
          intent={showMessage.intent}
          show={showMessage.show}
          snackContent={showMessage.snackContent}
        />
      </div>

      <Formik
        initialValues={{
          reservedFor: '',
          userId: '',
          passCount: {
            adults: '',
            children: '',
          },
        }}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setSubmitting(true);

          await onSubmit(values, resetForm);

          setSubmitting(false);
        }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={assignPassValidation}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form className="w-full space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <div>
                <Text className="after:content-['*'] after:ml-0.5 after:text-red">
                  Assign date
                </Text>
              </div>
              <div>
                <DateRange
                  asSingle={true}
                  disableAllocatedDates={disableDates}
                  isDisabledPastDates={true}
                  onChange={value => {
                    setDate(value);
                    handleChange({
                      target: {
                        name: 'reservedFor',
                        value: value?.startDate,
                      },
                    });
                  }}
                  onMonthChange={value => {
                    setMonthYear(value);
                  }}
                  showFooter={false}
                  showShortcuts={false}
                  useRange={false}
                  value={date}
                />
              </div>
              <Text intent={'red'} size={'sm'}>
                {errors.reservedFor &&
                  touched.reservedFor &&
                  errors.reservedFor}
              </Text>
            </div>
            <div className="space-y-2">
              <div>
                <Text className="after:content-['*'] after:ml-0.5 after:text-red">
                  Assign user
                </Text>
              </div>
              <div>
                <AutoSuggest
                  items={users || []}
                  onChange={(value: string) => {
                    setEmail(value);
                  }}
                  onSelect={function (value: Item): void {
                    handleChange({
                      target: {
                        name: 'userId',
                        value: value.id,
                      },
                    });
                  }}
                  placeholderText="Select user"
                  tabIndex={() => {}}
                />
              </div>
              <Text intent={'red'} size={'sm'}>
                {errors.userId && touched.userId && errors.userId}
              </Text>
            </div>
            <div className="space-y-2">
              <div>
                <Text className="after:content-['*'] after:ml-0.5 after:text-red">
                  Pass Count
                </Text>
              </div>
              <div className="space-y-2">
                <InputContainer>
                  <Input
                    name="passCount.adults"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter no. of adult passes"
                    type="number"
                    value={values.passCount.adults}
                  />
                </InputContainer>
                <Text intent={'red'} size={'sm'}>
                  {errors.passCount?.adults &&
                    touched.passCount?.adults &&
                    errors.passCount?.adults}
                </Text>
                <InputContainer>
                  <Input
                    name="passCount.children"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter no. of child passes"
                    type="number"
                    value={values.passCount.children}
                  />
                </InputContainer>
                <Text intent={'red'} size={'sm'}>
                  {errors.passCount?.children &&
                    touched.passCount?.children &&
                    errors.passCount?.children}
                </Text>
              </div>
            </div>
            <div className="flex items-center justify-end py-4 bg-gray-100 rounded-b-lg">
              <Button
                intent="primary"
                loading={isSubmitting}
                size={'md'}
                type="submit"
              >
                Create Pass
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AssignPasses;
