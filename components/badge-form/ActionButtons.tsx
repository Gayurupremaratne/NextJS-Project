import { Button, Heading, Text } from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import { FormActions } from '@/constants/form-actions';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useDeleteBadge, useGetBadgeById } from '@/hooks/badge/badge';
import { theme } from '@/tailwind.config';
import { IBadgeEn } from '@/types/badge/badge.type';
import { Edit2, MinusCirlce } from 'iconsax-react';
import { useState } from 'react';
import CustomCan from '../casl/CustomCan';
import { BadgeForm } from './BadgeForm';
import { AlertDialog } from '../atomic/Modal';
import { useSnackbarStore } from '@/store/snackbar/snackbar';
import { isAxiosError } from 'axios';

export interface Props {
  initialData: IBadgeEn;
}
export const ActionButtons = ({ initialData }: Props) => {
  const { data } = useGetBadgeById(initialData.id as string);
  const [show, setShow] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const deleteBadge = useDeleteBadge();
  const { setMessage, setSnackbar } = useSnackbarStore();
  const handleDelete = async () => {
    try {
      await deleteBadge.mutateAsync(initialData?.id as string);
    } catch (error: unknown) {
      setSnackbar(true);
      setMessage(
        isAxiosError(error)
          ? error.response?.data.message
          : 'Something went wrong, please try again',
      );
    }
  };

  const renderActionButtons = () => {
    return (
      <div className="flex items-center gap-x-6 justify-end">
        <CustomCan a={Subject.Badges} I={UserActions.Update}>
          <Button
            intent="ghost"
            onClick={() => setShow(true)}
            postIcon={<Edit2 size="16" variant="Bulk" />}
            size="ghost"
          />
        </CustomCan>
        <CustomCan a={Subject.Badges} I={UserActions.Delete}>
          <Button
            intent="ghost"
            onClick={() => {
              setshowModal(true);
            }}
            postIcon={
              <MinusCirlce color={theme.colors.red} size="20" variant="Bulk" />
            }
            size={'ghost'}
          />
        </CustomCan>
      </div>
    );
  };
  return (
    <>
      {renderActionButtons()}
      <SlideOver
        setShow={value => setShow(value)}
        show={show}
        title="Edit badge"
      >
        <BadgeForm
          action={FormActions.EDIT}
          initialData={data}
          setSlideOver={setShow}
        />
      </SlideOver>
      {showModal && (
        <AlertDialog
          buttonFunction={() => handleDelete()}
          buttontText="Delete"
          modalTitle="Delete Badge"
          setShow={value => setshowModal(value)}
          show={showModal}
        >
          <Heading
            intent={'h6'}
          >{`Are you sure you want to delete "${initialData.name}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            {
              'You cannot undo this action. All text and information associated with this badge will be permanently deleted.'
            }
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
