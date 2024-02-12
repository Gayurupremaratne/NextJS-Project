import { Button, Heading, Text } from '@/components/atomic';
import { AlertDialog } from '@/components/atomic/Modal';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import { FormActions } from '@/constants/form-actions';
import {
  useDeletePromotion,
  useGetPromotion,
} from '@/hooks/promotion/promotion';
import { Promotion } from '@/types/promotions/promotion.type';
import { Edit2, MinusCirlce } from 'iconsax-react';
import { useState } from 'react';
import { PromotionForm } from './forms/PromotionForm';

export interface Props {
  initialData: Promotion;
}

export const ActionButtons = ({ initialData }: Props) => {
  const { data } = useGetPromotion(initialData?.id as string);
  const deletePromotion = useDeletePromotion();
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    await deletePromotion.mutateAsync(initialData.id as string);
  };

  const renderActionButtons = () => {
    return (
      <div className="flex w-full justify-end items-end gap-x-6">
        <Button
          intent="ghost"
          onClick={() => setShow(true)}
          postIcon={<Edit2 size="16" variant="Bulk" />}
          size={'ghost'}
        />
        <Button
          intent="ghost"
          onClick={() => {
            setShowModal(true);
          }}
          postIcon={<MinusCirlce color="red" size="16" variant="Bulk" />}
          size={'ghost'}
        />
      </div>
    );
  };

  return (
    <div className="flex items-center">
      {renderActionButtons()}
      <SlideOver
        setShow={value => setShow(value)}
        show={show}
        title="Edit promotion details"
      >
        <PromotionForm
          action={FormActions.EDIT}
          initialData={data}
          setSlideOver={setShow}
        />
      </SlideOver>
      {showModal && (
        <AlertDialog
          buttonFunction={() => handleDelete()}
          buttontText="Delete"
          modalTitle="Delete promotion"
          setShow={value => setShowModal(value)}
          show={showModal}
        >
          <Heading
            intent={'h6'}
          >{`Are you sure you want to delete "${data?.promotionTranslations?.find(
            t => t.localeId === 'en',
          )?.title}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            {
              'You cannot undo this action. All images, text and information associated with this promotion will be permanently deleted. '
            }
          </Text>
        </AlertDialog>
      )}
    </div>
  );
};
