import { Tabs } from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import React, { useState } from 'react';
import CreateTrailForm from './forms/CreateTrailForm';
import { FormActions } from '@/constants/form-actions';
import AddTrailAssetForm from './forms/AddTrailAssetForm';
import { Stage } from '@/types/stage/stage.type';

interface Props {
  show: boolean;
  setShow: (value: boolean) => void;
  initialData: Stage;
}

const EditStageSlideOver = ({ show, setShow, initialData }: Props) => {
  const [formDirty, setFormDirty] = useState(false);
  return (
    <SlideOver
      setShow={value => setShow(value)}
      show={show}
      title="Edit trail information"
    >
      <div className="flex flex-col gap-3 w-full">
        <Tabs
          disabledIndex={formDirty ? 1 : undefined}
          intent="Secondary"
          tabData={[
            {
              title: '01: Trail information',
              content: (
                <div className="w-full flex-col">
                  <CreateTrailForm
                    action={FormActions.EDIT}
                    initialData={initialData}
                    setFormDirty={setFormDirty}
                    setSlideOver={setShow}
                  />
                </div>
              ),
            },
            {
              title: '02: Trail assets',
              content: (
                <div className="w-full flex-col">
                  <AddTrailAssetForm
                    action={FormActions.EDIT}
                    setSlideOver={setShow}
                    stageId={initialData?.id as string}
                  />
                </div>
              ),
            },
          ]}
          tabIndex={() => {}}
        />
      </div>
    </SlideOver>
  );
};

export default EditStageSlideOver;
