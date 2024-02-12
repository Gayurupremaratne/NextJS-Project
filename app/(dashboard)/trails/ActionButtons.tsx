'use client';

import { Button } from '@/components/atomic';
import { Stage } from '@/types/stage/stage.type';
import { Edit2, Eye } from 'iconsax-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EditStageSlideOver from './EditStageSlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';

export interface Props {
  initialData: Stage;
}

export const ActionButtons = ({ initialData }: Props) => {
  const router = useRouter();

  const [show, setShow] = useState(false);

  const handleViewUsersTrail = () => {
    router.push(`/trails/${initialData.id}`);
  };

  const renderActionButtons = () => {
    return (
      <div className="flex w-full items-center justify-end gap-x-6">
        <Button
          intent="ghost"
          // eslint-disable-next-line
          onClick={() => {
            handleViewUsersTrail();
          }}
          postIcon={<Eye size="16" variant="Bulk" />}
          size={'ghost'}
        />
        <CustomCan a={Subject.Trail} I={UserActions.Update}>
          <Button
            intent="ghost"
            onClick={() => setShow(true)}
            postIcon={<Edit2 size="16" variant="Bulk" />}
            size={'ghost'}
          />
        </CustomCan>
      </div>
    );
  };

  return (
    <div className="flex items-center">
      {renderActionButtons()}
      <EditStageSlideOver
        initialData={initialData}
        setShow={setShow}
        show={show}
      />
    </div>
  );
};
