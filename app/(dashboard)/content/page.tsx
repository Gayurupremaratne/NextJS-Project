'use client';
import { DataTable, Heading, Text } from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetGuidelines } from '@/hooks/guideline/guideline';
import { useGetPassConditions } from '@/hooks/passConditions/passConditions';
import { ContentTable } from '@/types/guidelines/guideline.type';
import { useState } from 'react';
import { columns } from './ContentColumns';
import { GuidelineForm } from './guideline-forms/GuidelineForm';

const ViewAllContent = () => {
  const [showSlide, setShowSlide] = useState(false);
  const [_, setCurrentPage] = useState<number>(0);

  const { data: guidelineData } = useGetGuidelines();
  const { data: passConditionData } = useGetPassConditions();

  const guidelineEnData = guidelineData?.metaTranslations.find(
    metaTranslation => metaTranslation.localeId === 'en',
  );
  const passConditionEnData = passConditionData?.metaTranslations.find(
    metaTranslation => metaTranslation.localeId === 'en',
  );

  const rows: ContentTable[] = [
    {
      type: 'Hiker Guidelines',
      title: guidelineEnData?.title ?? '-',
      description: guidelineEnData?.description ?? '-',
    },
    {
      type: 'Pass Conditions',
      title: passConditionEnData?.title ?? '-',
      description: passConditionEnData?.description ?? '-',
    },
  ];

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  return (
    <CustomCan
      a={Subject.OnboardingGuidelines || Subject.PassCondition}
      I={UserActions.Read}
      isForbidden={true}
    >
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex lg:flex-row flex-col justify-between gap-3 lg:gap-0">
          <div className="flex flex-col gap-2 w-full lg:w-72 xl:w-[420px]">
            <Heading intent={'h3'}>
              Guidelines / Conditions ({rows?.length})
            </Heading>
            <Text
              className="text-tints-battleship-grey-tint-2"
              size={'md'}
              weight={'medium'}
            >
              Overview of all guidelines/conditions
            </Text>
          </div>
        </div>
        {
          <DataTable<ContentTable>
            columns={columns}
            currentPage={1}
            data={rows}
            isSortEnabled={false}
            onPageChange={handlePageChange}
            totalPages={0}
          />
        }
      </div>
      <SlideOver
        setShow={value => setShowSlide(value)}
        show={showSlide}
        title="Edit Guideline"
      >
        <GuidelineForm setSlideOver={setShowSlide} />
      </SlideOver>
    </CustomCan>
  );
};
export default ViewAllContent;
