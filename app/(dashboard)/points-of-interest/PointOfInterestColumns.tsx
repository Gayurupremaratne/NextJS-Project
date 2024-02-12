'use client';
import { Button, Heading, Text } from '@/components/atomic';
import { AlertDialog } from '@/components/atomic/Modal';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { FormActions } from '@/constants/form-actions';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useDeletePointOfInterest } from '@/hooks/pointOfInterest/pointOfInterest';
import { PointOfInterest } from '@/types/pointOfInterests/pointOfInterest.type';
import { ColumnDef } from '@tanstack/react-table';
import { Edit2, MinusCirlce } from 'iconsax-react';
import { useState } from 'react';
import { PointOfInterestForm } from './forms/PointOfInterestForm';

const EditViewCellComponent = (pointOfInterestData: PointOfInterest) => {
  const deletePointOfInterest = useDeletePointOfInterest();
  const [showSlide, setShowSlide] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    const response = await deletePointOfInterest.mutateAsync(
      pointOfInterestData.id as string,
    );
    if (response?.status === 200) {
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="flex justify-end w-full gap-x-6">
        <CustomCan a={Subject.PointOfInterest} I={UserActions.Update}>
          <Button
            intent="ghost"
            onClick={() => {
              setShowSlide(true);
            }}
            postIcon={<Edit2 size="16" variant="Bulk" />}
            size={'ghost'}
          />
        </CustomCan>
        <CustomCan a={Subject.PointOfInterest} I={UserActions.Delete}>
          <Button
            intent="ghost"
            onClick={() => {
              setShowModal(true);
            }}
            postIcon={<MinusCirlce color="red" size="16" variant="Bulk" />}
            size={'ghost'}
          />
        </CustomCan>
      </div>
      <SlideOver
        setShow={value => setShowSlide(value)}
        show={showSlide}
        title="Edit point of interest"
      >
        <PointOfInterestForm
          action={FormActions.EDIT}
          initialData={pointOfInterestData}
          setSlideOver={value => setShowSlide(value)}
        />
      </SlideOver>
      <AlertDialog
        buttonFunction={() => handleDelete()}
        buttontText="Delete"
        modalTitle="Delete point of interest"
        setShow={value => setShowModal(value)}
        show={showModal}
      >
        <Heading
          intent={'h6'}
        >{`Are you sure you want to delete "${pointOfInterestData.pointOfInterestTranslation?.find(
          t => t.localeId === 'en',
        )?.title}"?`}</Heading>
        <Text
          className="text-tints-battleship-grey-tint-3 mt-2"
          size={'sm'}
          weight={'normal'}
        >
          {
            'You cannot undo this action. All images, text and information associated with this point of interest will be permanently deleted. '
          }
        </Text>
      </AlertDialog>
    </>
  );
};

export const columns: ColumnDef<PointOfInterest>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    enableSorting: true,
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text intent={'dark'} size={'md'} weight={'medium'}>
            {row.original.title}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'stage',
    header: 'Stages assigned to',
    enableSorting: false,
    cell: ({ row }) => {
      const stageNumbers = row.original.pointOfInterestStage
        .map(stage => {
          const stageNumber = stage?.number.toString().padStart(2, '0');
          return 'STAGE ' + stageNumber;
        })
        .join(', ');

      return (
        <div className="flex items-center">
          <Text
            className="tracking-wide"
            intent={'forestGreenTintTwo'}
            size={'xs'}
            weight={'bold'}
          >
            {stageNumbers}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'id',
    header: '',
    cell: ({ row }) => {
      return EditViewCellComponent(row.original);
    },
  },
];
