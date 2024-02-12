import React, { useEffect } from 'react';
import { AlertDialog } from '../atomic/Modal';
import { FormikProps } from 'formik';
import { FormData } from './PassAllocation';
import { InputContainer, Text, TextArea } from '@/components/atomic';
import { useGetInventoriesReservation } from '@/hooks/inventory/inventory';

interface Props {
  formik: FormikProps<FormData>;
  setShowConfirmationModal: (value: boolean) => void;
  showConfirmationModal: boolean;
  stageId: string;
}

const StageClosureConfirmation = ({
  formik,
  setShowConfirmationModal,
  showConfirmationModal,
  stageId,
}: Props) => {
  const { data, refetch } = useGetInventoriesReservation({
    stageId,
    startDate: formik.values.selectedDateRange.startDate
      ? formik.values.selectedDateRange.startDate
      : '',
    endDate: formik.values.selectedDateRange.endDate
      ? formik.values.selectedDateRange.endDate
      : '',
  });

  useEffect(() => {
    if (showConfirmationModal) {
      refetch();
    }
  }, [showConfirmationModal]);

  return (
    <AlertDialog
      buttonFunction={formik.handleSubmit}
      buttontText="Cancel"
      confirmButtonText={'Confirm stage closure'}
      confirmButtonType={'submit'}
      modalTitle="Confirm stage closure"
      setShow={value => setShowConfirmationModal(value)}
      show={showConfirmationModal}
    >
      {data && data.count > 0 && (
        <Text className="mt-2 mb-5" size={'md'} weight={'medium'}>
          Please note closing this stage for the selected date range will cancel
          all {data?.count} passes booked for this period
        </Text>
      )}
      <Text
        className="after:content-['*'] after:ml-0.5 after:text-red"
        size={'md'}
        weight={'normal'}
      >
        Reason for trail closure
      </Text>
      <InputContainer className="my-2">
        <TextArea
          className="rounded"
          containerClassName="w-full h-28"
          name="reason"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          placeholder={'Reason here'}
          value={formik.values.reason}
        />
      </InputContainer>
      <Text intent={'red'} size={'sm'}>
        {formik.errors.reason}
      </Text>
      <Text
        className="text-tints-battleship-grey-tint-4 mt-2"
        size={'sm'}
        weight={'normal'}
      >
        {
          'By confirming you agree that all passes for the selected period will be cancelled and an email notification will be sent to affected users.'
        }
      </Text>
    </AlertDialog>
  );
};

export default StageClosureConfirmation;
