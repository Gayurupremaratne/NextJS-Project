'use client';

import { Label, Text } from '@/components/atomic';
import { Stage, Translation } from '@/types/stage/stage.type';
import { ColumnDef } from '@tanstack/react-table';
import { Grammerly } from 'iconsax-react';
import { ActionButtons } from './ActionButtons';

// Function to render the status of the user
const getStageStatus = (isOpen: boolean) => {
  return (
    <span>
      {isOpen ? (
        <Label
          className="!text-snacks-borders-success"
          intent="active"
          postIcon={<Grammerly size={16} variant="Bold" />}
        >
          Active
        </Label>
      ) : (
        <Label
          intent="inactive"
          postIcon={<Grammerly size={16} variant="Bold" />}
        >
          Inactive
        </Label>
      )}
    </span>
  );
};

const getHeadToTail = (translations: Translation[]) => {
  const translation = translations?.find(
    stageTranslation => stageTranslation.localeId === 'en',
  );
  return (
    <Text
      size="md"
      weight="medium"
    >{`${translation?.stageHead} / ${translation?.stageTail}`}</Text>
  );
};

export const getStageTableColumns = (): ColumnDef<Stage>[] => {
  return [
    {
      accessorKey: 'number',
      header: 'Trail',
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-x-3">
            <Text
              className="text-tints-forest-green-tint-2"
              size="xs"
              weight={'bold'}
            >{`STAGE ${row?.original?.number}`}</Text>
            {getHeadToTail(row?.original?.translations)}
          </div>
        );
      },
    },
    {
      accessorKey: 'difficultyType',
      header: 'Difficulty',
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Text size="md" weight="medium">
              {row?.original?.difficultyType.charAt(0) +
                row?.original?.difficultyType.slice(1).toLowerCase()}
            </Text>
          </div>
        );
      },
    },
    {
      accessorKey: 'distance',
      header: 'Distance',
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Text
              size="md"
              weight="medium"
            >{`${row?.original?.distance}km`}</Text>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      enableSorting: true,
      cell: ({ row }) => getStageStatus(row?.original?.open),
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => <ActionButtons initialData={row.original} />,
    },
  ];
};
