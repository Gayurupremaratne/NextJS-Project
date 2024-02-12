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
import { useGetPointOfInterests } from '@/hooks/pointOfInterest/pointOfInterest';
import { PointOfInterest } from '@/types/pointOfInterests/pointOfInterest.type';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { columns } from './PointOfInterestColumns';
import { PointOfInterestForm } from './forms/PointOfInterestForm';
import { SearchNormal1 } from 'iconsax-react';

const ViewAllPointOfInterests = () => {
  const [showSlide, setShowSlide] = useState(false);
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

  const { data, refetch } = useGetPointOfInterests(fetchDataOptions);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (!_.isEmpty(data?.meta)) {
      setTotalPages(data?.meta.lastPage as number);
    }
    if (data?.meta && currentPage >= data?.meta?.lastPage) {
      setCurrentPage(data?.meta?.lastPage - 1);
    }
    refetch();
  }, [data]);

  useEffect(() => {
    refetch();
  }, [currentPage, sortBy]);

  const debouncedSetSearch = _.debounce(() => refetch(), 1000);

  useEffect(() => {
    debouncedSetSearch();
    setCurrentPage(0);
  }, [search]);

  return (
    <CustomCan
      a={Subject.PointOfInterest}
      I={UserActions.Read}
      isForbidden={true}
    >
      <div className="w-full flex flex-col gap-8">
        <div className="md:w-full sm:w-1/2 flex lg:flex-row flex-col justify-between gap-3 lg:gap-0 items-start">
          <div className="flex flex-col gap-2 w-full lg:w-48 xl:w-96">
            <Heading intent={'h3'}>
              Point of interests ({data?.meta?.total})
            </Heading>
            <Text
              className="text-tints-battleship-grey-tint-2"
              size={'md'}
              weight={'medium'}
            >
              Overview of all points of interests
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
            <CustomCan a={Subject.PointOfInterest} I={UserActions.Create}>
              <div>
                <Button
                  intent="primary"
                  onClick={() => setShowSlide(!showSlide)}
                  size={'md'}
                >
                  Create new POI
                </Button>
              </div>
            </CustomCan>
          </div>
        </div>
        {data?.data && (
          <DataTable<PointOfInterest>
            columns={columns}
            currentPage={currentPage}
            data={data?.data}
            onPageChange={handlePageChange}
            setSortBy={e => {
              setSortBy(e);
            }}
            totalPages={totalPages}
          />
        )}
      </div>
      <SlideOver
        setShow={value => setShowSlide(value)}
        show={showSlide}
        title="Create point of interest"
      >
        <PointOfInterestForm
          action={FormActions.ADD}
          setSlideOver={value => setShowSlide(value)}
        />
      </SlideOver>
    </CustomCan>
  );
};

export default ViewAllPointOfInterests;
