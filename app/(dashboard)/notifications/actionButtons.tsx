import { Button, Heading, Text } from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import { Edit2, Eye, MinusCirlce } from 'iconsax-react';
import { useState } from 'react';
import { AlertDialog } from '@/components/atomic/Modal';
import {
  useDeleteNotification,
  useGetNotificationById,
} from '@/hooks/notifications/notification';
import { EnNotification } from '@/types/notifications/notification.type';
import { theme } from '@/tailwind.config';
import { NotificationForm } from './forms/NotificationForm';
import { FormActions } from '@/constants/form-actions';
export interface Props {
  initialData: EnNotification;
}

export const ActionButtons = ({ initialData }: Props) => {
  const [show, setShow] = useState(false);
  const { data } = useGetNotificationById(initialData.id as string);
  const [showModal, setShowModal] = useState(false);

  const deleteNotification = useDeleteNotification();

  const handleDelete = async () => {
    await deleteNotification.mutateAsync(initialData?.id as string);
  };

  const renderActionButtons = () => {
    return (
      <div className="flex justify-end items-end gap-x-6">
        {initialData.isEligibleForModifyOrDelete ? (
          <div className="flex flex-row gap-x-6">
            <CustomCan a={Subject.Notifications} I={UserActions.Update}>
              <Button
                intent="ghost"
                onClick={() => setShow(true)}
                postIcon={<Edit2 size="16" variant="Bulk" />}
                size="ghost"
              />
            </CustomCan>
            <CustomCan a={Subject.Notifications} I={UserActions.Read}>
              <Button
                intent="ghost"
                postIcon={<Eye size="16" variant="Bulk" />}
                size={'ghost'}
              />
            </CustomCan>
            <CustomCan a={Subject.Trail} I={UserActions.Delete}>
              <Button
                intent="ghost"
                onClick={() => {
                  setShowModal(true);
                }}
                postIcon={
                  <MinusCirlce
                    color={theme.colors.red}
                    size="16"
                    variant="Bulk"
                  />
                }
                size={'ghost'}
              />
            </CustomCan>
          </div>
        ) : (
          <div className="flex justify-end items-end">
            <CustomCan a={Subject.Notifications} I={UserActions.Read}>
              <Button
                intent="ghost"
                postIcon={<Eye size="16" variant="Bulk" />}
                size={'ghost'}
              />
            </CustomCan>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderActionButtons()}
      {show && (
        <SlideOver
          setShow={value => setShow(value)}
          show={true}
          title={'Edit notification'}
        >
          <NotificationForm
            action={FormActions.EDIT}
            initialData={data}
            setSlideOver={value => setShow(value)}
          />
        </SlideOver>
      )}
      {showModal && (
        <AlertDialog
          buttonFunction={() => handleDelete()}
          buttontText="Delete"
          modalTitle="Delete notification"
          setShow={value => setShowModal(value)}
          show={showModal}
        >
          <Heading
            intent={'h6'}
          >{`Are you sure you want to delete "${initialData?.title}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            You cannot undo this action. All text and information associated
            with this notification will be permanently deleted.
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
