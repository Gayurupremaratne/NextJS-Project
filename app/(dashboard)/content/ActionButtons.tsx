'use client';

import { Button } from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import useGuidelineStore from '@/store/guideline/useGuidelineStore';
import usePassConditionStore from '@/store/passConditions/usePassConditionStore';
import { Edit2 } from 'iconsax-react';
import { useState } from 'react';
import { GuidelineForm } from './guideline-forms/GuidelineForm';
import { PassConditionForm } from './pass-condition-forms/PassCondition';

interface Props {
  rowId: string;
}

export const ActionButtons = ({ rowId }: Props) => {
  const [show, setShow] = useState(false);
  const guidelineData = useGuidelineStore(state => state.data);
  const passCondition = usePassConditionStore(state => state.data);

  const renderActionButtons = () => {
    return (
      <CustomCan
        a={Subject.OnboardingGuidelines || Subject.PassCondition}
        I={UserActions.Update}
      >
        <div className="flex w-full justify-end items-end gap-x-6">
          <Button
            intent="ghost"
            onClick={() => setShow(true)}
            postIcon={<Edit2 size="16" variant="Bulk" />}
            size="ghost"
          />
        </div>
      </CustomCan>
    );
  };

  return (
    <div className="flex items-center">
      {renderActionButtons()}
      <CustomCan a={Subject.OnboardingGuidelines} I={UserActions.Update}>
        <SlideOver
          setShow={value => setShow(value)}
          show={show && rowId == '0'}
          title="Edit hiker guidelines"
        >
          <div className="flex flex-col gap-3 w-full">
            <div className="w-full flex-col">
              <GuidelineForm
                initialData={guidelineData}
                setSlideOver={setShow}
              />
            </div>
          </div>
        </SlideOver>
      </CustomCan>
      <CustomCan a={Subject.PassCondition} I={UserActions.Update}>
        <SlideOver
          setShow={value => setShow(value)}
          show={show && rowId == '1'}
          title="Edit pass conditions"
        >
          <div className="flex flex-col gap-3 w-full">
            <div className="w-full flex-col">
              <PassConditionForm
                initialData={passCondition}
                setSlideOver={setShow}
              />
            </div>
          </div>
        </SlideOver>
      </CustomCan>
    </div>
  );
};
