'use client';

import {
  Button,
  Checkbox,
  Input,
  InputContainer,
  Text,
} from '@/components/atomic';
import { useUpdateInventoryPassAllocation } from '@/hooks/inventory/inventory';
import { InventoryPassAllocation } from '@/types/inventory/inventory.type';
import { useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { DateRange } from '../atomic/DateRange';
import { DateValueType } from '../atomic/DateRange/types';
import { Snackbar, SnackbarProps } from '../atomic/Snackbar/Snackbar';
import { passAllocationValidation } from './PassAllocationValidation';
import StageClosureConfirmation from './StageClosureConfirmation';

interface Props {
  stageId: string;
  currentMonth: Date;
}

export interface FormData {
  selectedDateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  passCount: number | null;
  confirmClose: boolean;
  reason: string;
}

const PassAllocation = ({ stageId, currentMonth }: Props) => {
  const queryClient = useQueryClient();

  const initialValues: FormData = {
    selectedDateRange: {
      startDate: null,
      endDate: null,
    },
    passCount: null,
    confirmClose: false,
    reason: '',
  };

  const initialSnackbarValue = {
    show: false,
    snackContent: '',
    intent: undefined,
  };

  const [date, setDate] = useState<DateValueType>(
    initialValues.selectedDateRange,
  );

  const [isStageClosure, setIsStageClosure] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const [showMessage, setShowMessage] =
    useState<SnackbarProps>(initialSnackbarValue);

  const updatePassAllocation = useUpdateInventoryPassAllocation(stageId);

  useEffect(() => {
    setShowMessage(initialSnackbarValue);
    setDate(initialValues.selectedDateRange);
  }, [stageId]);

  const submitPassAllocation = async ({
    quantity,
    startDate,
    endDate,
    stageClosure,
    stageClosureReason,
  }: InventoryPassAllocation) => {
    try {
      const response = await updatePassAllocation.mutateAsync({
        quantity,
        startDate,
        endDate,
        stageClosure,
        stageClosureReason,
      });
      if (response.status == 200 || response.status == 206) {
        setShowMessage({
          show: true,
          snackContent:
            response.status === 206
              ? response.data.message ??
                'Inventory has been updated according to the number of passes booked!'
              : 'Pass allocation successful!',
          intent: 'success',
        });

        queryClient.invalidateQueries([
          'get-inventories-by-month',
          stageId,
          (currentMonth.getMonth() + 1).toString(),
          currentMonth.getFullYear().toString(),
        ]);
      } else {
        setShowMessage({
          show: true,
          snackContent: 'Pass allocation failed!',
          intent: 'error',
        });
      }
    } catch (error) {
      setShowMessage({
        show: true,
        snackContent: 'Pass allocation failed!',
        intent: 'error',
      });
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      setSubmitting(false);

      setShowMessage({
        show: false,
        snackContent: '',
        intent: undefined,
      });

      if (
        typeof values.passCount === 'undefined' ||
        values.passCount === null
      ) {
        return;
      }

      await submitPassAllocation({
        quantity: values.passCount,
        startDate: values.selectedDateRange.startDate,
        endDate: values.selectedDateRange.endDate,
        stageClosure: values.confirmClose,
        stageClosureReason: values.confirmClose ? values.reason : undefined,
      });

      setDate({ startDate: null, endDate: null });
      resetForm({ values: initialValues });
      setShowConfirmationModal(false);
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: passAllocationValidation,
  });

  useEffect(() => {
    if (formik.values?.passCount === 0) {
      setIsStageClosure(true);
    } else {
      setIsStageClosure(false);
    }
  }, [formik.values.passCount]);

  return (
    <>
      <Snackbar
        intent={showMessage.intent}
        show={showMessage.show}
        snackContent={showMessage.snackContent}
      />

      <div className="flex justify-between mt-10">
        <form
          className="md:flex flex-row w-full justify-between md:space-y-0 space-y-4"
          onSubmit={formik.handleSubmit}
        >
          <div className="md:w-1/4 w-full">
            <Text intent={'green'} size={'md'} weight={'semiBold'}>
              Pass allocation
            </Text>
            <Text intent={'grey'} size={'md'} weight={'medium'}>
              Manage passes for particular date range
            </Text>
          </div>
          <div className="md:flex gap-2 md:space-y-0 space-y-4 align items-center">
            <div>
              <div className="min-w-[275px]">
                <DateRange
                  displayFormat="DD MMM YYYY"
                  isDisabledPastDates={true}
                  onChange={value => {
                    setDate(value);
                    formik.handleChange({
                      target: {
                        name: 'selectedDateRange',
                        value: value,
                      },
                    });
                  }}
                  placeholder={'Select date'}
                  showFooter={false}
                  showShortcuts={false}
                  useRange={false}
                  value={date}
                />
              </div>
              <Text intent={'red'} size={'sm'}>
                {formik.errors.selectedDateRange &&
                  formik.errors.selectedDateRange.startDate}
              </Text>
            </div>
            <div>
              <InputContainer>
                <Input
                  name="passCount"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={'Enter no. of passes'}
                  type="number"
                  value={formik.values.passCount ?? ''}
                />
              </InputContainer>
              <Text intent={'red'} size={'sm'}>
                {formik.errors.passCount &&
                  formik.touched.passCount &&
                  formik.errors.passCount}
              </Text>
            </div>
            {isStageClosure && (
              <div>
                <Checkbox
                  checked={formik.values.confirmClose}
                  label={'Stage closure'}
                  onChange={() =>
                    formik.setFieldValue(
                      'confirmClose',
                      !formik.values.confirmClose,
                    )
                  }
                />
              </div>
            )}
            <div>
              <Button
                disabled={formik.isSubmitting}
                intent="primary"
                onClick={() => {
                  if (
                    formik.values.passCount === 0 &&
                    formik.values.confirmClose
                  ) {
                    setShowConfirmationModal(true);
                  }
                }}
                type={
                  formik.values.passCount === 0 && formik.values.confirmClose
                    ? 'button'
                    : 'submit'
                }
              >
                Confirm allocation
              </Button>
            </div>
          </div>
          {formik.values.selectedDateRange?.startDate &&
            formik.values.selectedDateRange?.endDate && (
              <StageClosureConfirmation
                formik={formik}
                setShowConfirmationModal={setShowConfirmationModal}
                showConfirmationModal={showConfirmationModal}
                stageId={stageId}
              />
            )}
        </form>
      </div>
    </>
  );
};

export default PassAllocation;
