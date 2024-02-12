'use client';
import {
  Button,
  DataTable,
  Heading,
  Item,
  SingleSelect,
  Text,
} from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import { TagForm } from '@/components/tag-form/TagForm';
import { FormActions } from '@/constants/form-actions';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetLiteStages } from '@/hooks/stage/stage';
import { useGetAllTags } from '@/hooks/tag/tag';
import { TagEn } from '@/types/tags/tags';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { columns } from './tagColumns';
import CustomCan from '@/components/casl/CustomCan';
import { StageLite } from '@/types/stage/stage.type';
import { UseParams } from '@/constants/useParams';

const ViewAllTags = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [stageNumber, setStageNumber] = useState<number | string | null>('');
  const [sortBy, setSortBy] = useState('');

  const fetchDataOptions: UseParams = {
    pageNumber: currentPage + 1,
    perPage: 10,
    sortBy: sortBy,
    stages: stageNumber,
  };
  const { data: tagsData, refetch: tagsRefetch } =
    useGetAllTags(fetchDataOptions);
  const { data: stagesData } = useGetLiteStages();

  const [show, setShow] = useState(false);
  const [stages, setStages] = useState<StageLite[]>([]);

  const handleStageChange = (e: string) => {
    const stageId = parseInt(e);
    if (e == 'select') {
      setStageNumber(null);
    } else if (e == 'all') {
      setStageNumber('all');
    } else {
      setStageNumber(stageId);
    }
  };

  useEffect(() => {
    if (tagsData) {
      setTotalPages(tagsData.meta?.lastPage);
    }
    if (tagsData && currentPage >= tagsData?.meta?.lastPage) {
      setCurrentPage(tagsData?.meta?.lastPage - 1);
    }
  }, [tagsData]);

  const debouncedSetTag = _.debounce(() => tagsRefetch(), 1000);

  useEffect(() => {
    debouncedSetTag();
  }, [stageNumber]);

  useEffect(() => {
    if (!show) {
      tagsRefetch();
    }
  }, [show]);

  useEffect(() => {
    tagsRefetch();
  }, [currentPage, sortBy]);

  useEffect(() => {
    if (stagesData && stagesData.length > 0) {
      setStages(stagesData);
    }
  }, [stagesData]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const getStage = () => {
    const optionalSelectStage = [
      {
        id: 'select',
        name: 'Select stage',
      },
      {
        id: 'all',
        name: 'All stages',
      },
    ];
    const mappedStages = stages.map((data: StageLite) => {
      return {
        id: data.number,
        name: `Stage ${data.number.toString()}`,
      };
    });
    return [...optionalSelectStage, ...mappedStages];
  };

  const getInitialStage = () => {
    return {
      id: 'select',
      name: 'Select stage',
    } as Item;
  };

  return (
    <CustomCan a={Subject.StageTag} I={UserActions.Read} isForbidden={true}>
      <div className="w-full flex flex-col gap-8">
        <div className="md:w-full sm:w-1/2 flex lg:flex-row flex-col justify-between gap-3 lg:gap-0 items-start">
          <div className="flex flex-col gap-2 w-full lg:w-48 xl:w-96">
            <Heading intent={'h3'}>
              {`Tags (${tagsData ? tagsData.meta?.total : 0})`}
            </Heading>
            <Text
              className="text-tints-battleship-grey-tint-2"
              size={'md'}
              weight={'medium'}
            >
              Overview of all tags
            </Text>
          </div>
          <div className="flex lg:flex-row flex-col h-fit gap-4 lg:gap-0 self-start place-items-start">
            <div className="w-40 mr-6">
              <SingleSelect
                initialSelected={getInitialStage()}
                items={getStage()}
                tabIndex={e => {
                  handleStageChange(e as string);
                }}
              />
            </div>
            <div>
              <CustomCan a={Subject.StageTag} I={UserActions.Create}>
                <Button intent="primary" onClick={() => setShow(!show)}>
                  Create new tags
                </Button>
              </CustomCan>
            </div>
            <SlideOver setShow={setShow} show={show} title="Create tag">
              <TagForm
                action={FormActions.ADD}
                setSlideOver={value => setShow(value)}
              />
            </SlideOver>
          </div>
        </div>
        {tagsData && (
          <DataTable<TagEn>
            columns={columns}
            currentPage={currentPage}
            data={tagsData?.data}
            onPageChange={handlePageChange}
            setSortBy={e => {
              setSortBy(e);
            }}
            totalPages={totalPages}
          />
        )}
      </div>
    </CustomCan>
  );
};
export default ViewAllTags;
