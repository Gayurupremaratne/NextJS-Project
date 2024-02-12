'use client';
import {
  Button,
  DataTable,
  Heading,
  Input,
  InputContainer,
  SingleSelect,
  Text,
} from '@/components/atomic';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { FormActions } from '@/constants/form-actions';
import { StatusFilter } from '@/constants/status-filter';
import { UseParams } from '@/constants/useParams';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetPromotions } from '@/hooks/promotion/promotion';
import { Promotion } from '@/types/promotions/promotion.type';
import { SearchNormal1 } from 'iconsax-react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { columns } from './PromotionColumns';
import { PromotionForm } from './forms/PromotionForm';

const ViewAllPromotions = () => {
  const [showSlide, setShowSlide] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchValue, setSearchValue] = useState('');
  const [status, setStatus] = useState<string>();
  const [sortBy, setSortBy] = useState('');
  const fetchDataOptions: UseParams = {
    pageNumber: currentPage + 1,
    search: searchValue,
    perPage: 10,
    status: status,
    sortBy: sortBy,
  };

  const filterStatus = [
    {
      id: StatusFilter.ALL,
      name: StatusFilter.ALL,
    },
    {
      id: StatusFilter.ACTIVE,
      name: StatusFilter.ACTIVE,
    },
    {
      id: StatusFilter.INACTIVE,
      name: StatusFilter.INACTIVE,
    },
  ];

  const { data, refetch } = useGetPromotions(fetchDataOptions);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleActiveStatus = (e: string) => {
    setStatus(e);
  };

  const debouncedSetSearch = _.debounce(() => refetch(), 1000);

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

  useEffect(() => {
    debouncedSetSearch();
    handlePageChange(0);
  }, [searchValue, status]);

  return (
    <CustomCan a={Subject.Promotions} I={UserActions.Read} isForbidden={true}>
      <div className="flex flex-col gap-3 w-full">
        <div className="mb-8">
          <div className="lg:flex justify-between flex-col xl:flex-row">
            <div className="flex flex-col gap-2">
              <Heading className="truncate" intent={'h3'}>
                Promotions ({data?.meta.total})
              </Heading>
              <Text
                className="text-tints-battleship-grey-tint-2 mt-2"
                size={'md'}
                weight={'medium'}
              >
                Overview of all promotions
              </Text>
            </div>
            <div className="flex justify-between flex-col xl:flex-row gap-y-3  xl:pt-0 pt-3">
              <div className="flex flex-row mr-6">
                <Text className="mt-2 mx-2" size={'md'} weight={'medium'}>
                  Status
                </Text>
                <div className="w-[140px]">
                  <SingleSelect
                    initialSelected={filterStatus[0]}
                    items={filterStatus}
                    tabIndex={e => {
                      handleActiveStatus(e as string);
                    }}
                  />
                </div>
              </div>
              <div className="mr-6">
                <InputContainer className="py-5 justify-end w-[300px] h-10">
                  <Input
                    className="rounded w-full text-sm"
                    icon={
                      <SearchNormal1
                        className="mx-2 text-shades-battleship-grey-shade-1"
                        size="16"
                        variant="Outline"
                      />
                    }
                    name="search"
                    onChange={event => setSearchValue(event.target.value)}
                    placeholder={'Search by promotion title'}
                    type="text"
                    value={searchValue}
                  />
                </InputContainer>
              </div>
              <CustomCan a={Subject.Promotions} I={UserActions.Create}>
                <div>
                  <Button
                    className="truncate"
                    intent="primary"
                    onClick={() => setShowSlide(!showSlide)}
                    size={'md'}
                  >
                    Create new promotion
                  </Button>
                </div>
              </CustomCan>
            </div>
          </div>
        </div>
        {data?.data && (
          <DataTable<Promotion>
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
        title="Create Promotion"
      >
        <PromotionForm action={FormActions.ADD} setSlideOver={setShowSlide} />
      </SlideOver>
    </CustomCan>
  );
};
export default ViewAllPromotions;
