'use client';

import {
  Button,
  DataTable,
  Heading,
  Input,
  InputContainer,
  Text,
} from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { FormActions } from '@/constants/form-actions';
import { UseParams } from '@/constants/useParams';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetStories } from '@/hooks/story/story';
import { StoryEn } from '@/types/stories/story.type';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { StoryForm } from '@/components/story-form/StoryForm';
import { columns } from './storyColumns';
import { SearchNormal1 } from 'iconsax-react';

const ViewAllStories = () => {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');

  const fetchDataOptions: UseParams = {
    pageNumber: currentPage + 1,
    search: search,
    perPage: 10,
    sortBy: sortBy,
  };

  const { data, refetch } = useGetStories(fetchDataOptions);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data?.meta?.lastPage);
    }
    if (data && currentPage >= data?.meta?.lastPage) {
      setCurrentPage(data?.meta?.lastPage - 1);
    }
    if (!show) {
      refetch();
    }
  }, [data, show]);

  useEffect(() => {
    refetch();
  }, [currentPage, sortBy]);

  const debouncedSetSearch = _.debounce(() => refetch(), 1000);

  useEffect(() => {
    debouncedSetSearch();
    setCurrentPage(0);
  }, [search]);

  return (
    <CustomCan a={Subject.Trail} I={UserActions.Read} isForbidden={true}>
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex lg:flex-row flex-col justify-between gap-3 lg:gap-0">
          <div className="flex flex-col gap-2 w-full lg:w-48 xl:w-96">
            <Heading intent={'h3'}>Audio stories ({data?.meta.total})</Heading>
            <Text
              className="text-tints-battleship-grey-tint-2"
              size={'md'}
              weight={'medium'}
            >
              Overview of all audio stories
            </Text>
          </div>
          <div className="flex lg:flex-row flex-col h-fit gap-4 lg:gap-0 self-start">
            <InputContainer className="mr-6">
              <Input
                className="rounded"
                icon={
                  <SearchNormal1
                    className="mx-2 text-shades-battleship-grey-shade-1"
                    size="16"
                    variant="Outline"
                  />
                }
                name="search"
                onChange={event => setSearch(event.target.value)}
                placeholder={'Search'}
                type="text"
                value={search}
              />
            </InputContainer>
            <CustomCan a={Subject.Trail} I={UserActions.Create}>
              <div>
                <Button
                  intent="primary"
                  onClick={() => setShow(!show)}
                  size={'md'}
                >
                  Create new audio story
                </Button>
              </div>
            </CustomCan>
            <SlideOver
              setShow={value => setShow(value)}
              show={show}
              title="Create audio story"
            >
              <StoryForm
                action={FormActions.ADD}
                setSlideOver={value => setShow(value)}
              />
            </SlideOver>
          </div>
        </div>

        {data && (
          <DataTable<StoryEn>
            columns={columns}
            currentPage={currentPage}
            data={data.data}
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

export default ViewAllStories;
