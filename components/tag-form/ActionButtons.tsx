import { Button, Heading, Text } from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import { FormActions } from '@/constants/form-actions';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useDeleteTag, useGetTagById } from '@/hooks/tag/tag';
import { theme } from '@/tailwind.config';
import { TagEn } from '@/types/tags/tags';
import { Edit2, MinusCirlce } from 'iconsax-react';
import { useState } from 'react';
import CustomCan from '../casl/CustomCan';
import { TagForm } from './TagForm';
import { AlertDialog } from '../atomic/Modal';

export interface Props {
  initialData: TagEn;
}

export const ActionButtons = ({ initialData }: Props) => {
  const { data } = useGetTagById(initialData.id as string);
  const [show, setShow] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const deleteTag = useDeleteTag();

  const handleDelete = async () => {
    await deleteTag.mutateAsync(initialData.id as string);
  };

  const renderActionButtons = () => {
    return (
      <div className="flex items-center w-full gap-x-6 justify-end">
        <CustomCan a={Subject.StageTag} I={UserActions.Update}>
          <Button
            intent="ghost"
            onClick={() => setShow(true)}
            postIcon={<Edit2 size="16" variant="Bulk" />}
            size="ghost"
          />
        </CustomCan>
        <CustomCan a={Subject.StageTag} I={UserActions.Delete}>
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
      <SlideOver setShow={value => setShow(value)} show={show} title="Edit tag">
        <div className="flex flex-col gap-3 w-full">
          <div className="w-full flex-col">
            <TagForm
              action={FormActions.EDIT}
              initialData={data}
              setSlideOver={setShow}
            />
          </div>
        </div>
      </SlideOver>

      {showModal && (
        <AlertDialog
          buttonFunction={() => handleDelete()}
          buttontText="Delete"
          modalTitle="Delete Tag"
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
              'You cannot undo this action. All text and information associated with this tag will be permanently deleted.'
            }
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
