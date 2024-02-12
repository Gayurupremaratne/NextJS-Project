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
import { UseParams } from '@/constants/useParams';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetNotifications } from '@/hooks/notifications/notification';
import { EnNotification } from '@/types/notifications/notification.type';
import { SearchNormal1 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import { columns } from './notificationColumns';
import _ from 'lodash';
import { NotificationForm } from './forms/NotificationForm';
import { FormActions } from '@/constants/form-actions';

const ViewAllNotifications = () => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortBy, setSortBy] = useState('');

  const fetchDataOptions: UseParams = {
    pageNumber: currentPage + 1,
    perPage: 10,
    search,
    sortBy,
  };

  const { data, refetch } = useGetNotifications(fetchDataOptions);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (data) {
      setTotalPages(data.meta?.lastPage);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [currentPage, sortBy]);

  const debouncedSetSearch = _.debounce(() => refetch(), 1000);

  useEffect(() => {
    debouncedSetSearch();
  }, [search]);

  return (
    <CustomCan
      a={Subject.Notifications}
      I={UserActions.Read}
      isForbidden={true}
    >
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex lg:flex-row flex-col justify-between gap-3 lg:gap-0">
          <div className="flex flex-col gap-2 w-full lg:w-48 xl:w-96">
            <Heading intent={'h3'}>Notifications ({data?.meta?.total})</Heading>
            <Text
              className="text-tints-battleship-grey-tint-2"
              size={'md'}
              weight={'medium'}
            >
              Overview of all notifications
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
                placeholder={'Search by title'}
                type="text"
                value={search}
              />
            </InputContainer>
            <CustomCan a={Subject.Notifications} I={UserActions.Create}>
              <div>
                <Button
                  intent="primary"
                  onClick={() => setShow(!show)}
                  size={'md'}
                >
                  Create notification
                </Button>
              </div>
            </CustomCan>
            <SlideOver
              setShow={value => setShow(value)}
              show={show}
              title="Create new notification"
            >
              <NotificationForm
                action={FormActions.ADD}
                setSlideOver={value => setShow(value)}
              />
            </SlideOver>
          </div>
        </div>
        {data && (
          <DataTable<EnNotification>
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
    </CustomCan>
  );
};

export default ViewAllNotifications;
