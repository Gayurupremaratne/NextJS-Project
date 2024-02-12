import { Button, Heading, Text } from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { FormActions } from '@/constants/form-actions';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useDeleteStory, useGetStoryById } from '@/hooks/story/story';
import { StoryEn } from '@/types/stories/story.type';
import { Edit2, MinusCirlce } from 'iconsax-react';
import { useState } from 'react';
import { StoryForm } from '@/components/story-form/StoryForm';
import { theme } from '@/tailwind.config';
import { AlertDialog } from '@/components/atomic/Modal';

export interface Props {
  initialData: StoryEn;
}

export const ActionButtons = ({ initialData }: Props) => {
  const [show, setShow] = useState(false);
  const [showModal, setshowModal] = useState(false);
  const deleteStory = useDeleteStory();
  const { data } = useGetStoryById(initialData.id as string, show);

  const handleDelete = () => deleteStory.mutateAsync(initialData.id as string);

  const renderActionButtons = () => {
    return (
      <div className="flex justify-end items-end gap-x-6">
        <CustomCan a={Subject.Trail} I={UserActions.Update}>
          <Button
            intent="ghost"
            onClick={() => setShow(true)}
            postIcon={<Edit2 size="16" variant="Bulk" />}
            size="ghost"
          />
        </CustomCan>
        <CustomCan a={Subject.Trail} I={UserActions.Delete}>
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
        title="Edit audio story"
      >
        <div className="flex flex-col gap-3 w-full">
          <div className="w-full flex-col">
            <StoryForm
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
          modalTitle="Delete audio story"
          setShow={value => setshowModal(value)}
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
            {
              'You cannot undo this action. All text and information associated with this audio story will be permanently deleted.'
            }
          </Text>
        </AlertDialog>
      )}
    </>
  );
};
