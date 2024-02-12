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
import { BadgeForm } from '@/components/badge-form/BadgeForm';
import CustomCan from '@/components/casl/CustomCan';
import { FormActions } from '@/constants/form-actions';
import { UseParams } from '@/constants/useParams';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetAllBadgesEn } from '@/hooks/badge/badge';
import { IBadgeEn } from '@/types/badge/badge.type';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { columns } from './badgeColumns';
import { SearchNormal1 } from 'iconsax-react';
import { useSnackbarStore } from '@/store/snackbar/snackbar';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';

const ViewAllBadges = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { showSnackbar, message } = useSnackbarStore();

  const fetchDataOptions: UseParams = {
    pageNumber: currentPage + 1,
    search: search,
    perPage: 10,
    sortBy: sortBy,
  };

  const { data: badgesData, refetch: badgesRefetch } =
    useGetAllBadgesEn(fetchDataOptions);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const debouncedSetSearch = _.debounce(() => badgesRefetch(), 1000);

  useEffect(() => {
    debouncedSetSearch();
    setCurrentPage(0);
  }, [search]);

  useEffect(() => {
    if (badgesData) {
      setTotalPages(badgesData?.meta?.lastPage);
    }
    if (badgesData && currentPage >= badgesData?.meta?.lastPage) {
      setCurrentPage(badgesData?.meta?.lastPage - 1);
    }
    if (!show) {
      badgesRefetch();
    }
  }, [badgesData, show]);

  useEffect(() => {
    badgesRefetch();
  }, [currentPage, sortBy]);

  return (
    <CustomCan a={Subject.Badges} I={UserActions.Read} isForbidden={true}>
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex lg:flex-row flex-col justify-between gap-3 lg:gap-0">
          <div className="flex flex-col gap-2 w-full lg:w-48 xl:w-96">
            <Heading intent={'h3'}>
              Achievements ({badgesData?.meta?.total})
            </Heading>
            <Text
              className="text-tints-battleship-grey-tint-2"
              size={'md'}
              weight={'medium'}
            >
              Overview of all badges
            </Text>
          </div>

          <div className="flex lg:flex-row flex-col h-fit gap-4 lg:gap-0 self-start">
            <InputContainer className="mr-6">
              <Input
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
            <CustomCan a={Subject.Badges} I={UserActions.Create}>
              <div>
                <Button onClick={() => setShow(!show)}>Create new badge</Button>
              </div>
            </CustomCan>
            <SlideOver setShow={setShow} show={show} title="Create badge">
              <BadgeForm
                action={FormActions.ADD}
                setSlideOver={value => setShow(value)}
              />
            </SlideOver>
          </div>
        </div>
        <div className="pb-2">
          <Snackbar
            intent="error"
            show={showSnackbar}
            snackContent={message}
            timeout={8000}
          />
        </div>
        {badgesData && (
          <DataTable<IBadgeEn>
            columns={columns}
            currentPage={currentPage}
            data={badgesData?.data}
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

export default ViewAllBadges;
