'use client';

import { useRouter } from 'next/navigation';
import {
  Avatar,
  Button,
  DataTable,
  Heading,
  Input,
  InputContainer,
  Label,
  SingleSelect,
  Text,
} from '@/components/atomic';
import {
  useGetStageById,
  useGetStageMedia,
  useGetStageUsersById,
} from '@/hooks/stage/stage';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import { Grammerly, SearchNormal1 } from 'iconsax-react';
import { DateRange } from '@/components/atomic/DateRange';
import { useEffect, useState } from 'react';
import { DateValueType } from '@/components/atomic/DateRange/types';
import { STAGE_USERS_LIST_PAGE_SIZE } from '@/constants/pagination-page-size';
import {
  Stage,
  StageMedia,
  StageUser,
  USER_SEARCH_FIELD_NAMES,
} from '@/types/stage/stage.type';
import { columns } from './stageUsersColumns';
import _ from 'lodash';
import EditStageSlideOver from '../EditStageSlideOver';
import { STAGE_MEDIA_KEY_TYPES } from '@/constants/stage-media-types';
import { getCode } from 'country-list';

interface Props {
  params: {
    id: string;
  };
}

const ViewUsersInTrail = ({ params }: Props) => {
  const router = useRouter();

  const fields = [
    { id: '1', name: 'First name' },
    { id: '2', name: 'Last name' },
    { id: '3', name: 'Email' },
    { id: '4', name: 'Country' },
  ];

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [stageMediaData, setStageMediaData] = useState<StageMedia[]>([]);
  const [date, setDate] = useState<DateValueType>({
    startDate: '',
    endDate: '',
  });
  const [searchValue, setSearchValue] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [show, setShow] = useState(false);

  const { data: stageMedia, refetch: refetchStageMedia } = useGetStageMedia(
    params.id,
  );
  const { data: stageData } = useGetStageById(params.id);
  const { data: stageUsers, refetch } = useGetStageUsersById(
    params.id,
    STAGE_USERS_LIST_PAGE_SIZE,
    currentPage + 1,
    selectedField,
    selectedField !== USER_SEARCH_FIELD_NAMES[3]
      ? searchValue
      : getCode(searchValue) ?? searchValue,
    typeof date?.startDate !== 'undefined' ? date?.startDate?.toString() : '',
  );

  useEffect(() => {
    if (stageUsers) {
      setTotalPages(stageUsers.data.data.meta?.lastPage);
    }
  }, [stageUsers]);

  useEffect(() => {
    refetch();
    refetchStageMedia();
  }, [currentPage]);

  useEffect(() => {
    if (stageMedia) {
      setStageMediaData(stageMedia?.data.data.data);
    }
  }, [stageMedia]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleFieldChange = (field: string) => {
    setSelectedField(USER_SEARCH_FIELD_NAMES[parseInt(field) - 1]);
  };

  const debouncedSetSearch = _.debounce(() => refetch(), 1000);

  useEffect(() => {
    refetch();
    setIsSearch(false);
  }, [isSearch]);

  useEffect(() => {
    debouncedSetSearch();
  }, [date?.startDate]);

  return (
    <CustomCan a={Subject.Trail} I={UserActions.Read} isForbidden={true}>
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full">
          <div className="flex md:flex-row flex-col lg:justify-between sm:gap-y-0 gap-y-4 w-full">
            <div className="flex md:flex-row flex-col items-center">
              <Avatar
                alt={'alt'}
                imageUrl={
                  stageMediaData.length &&
                  stageMediaData.some(
                    media =>
                      media.mediaType === STAGE_MEDIA_KEY_TYPES.MAIN_IMAGE,
                  )
                    ? `${
                        process.env.NEXT_PUBLIC_CLOUDFRONT_URL
                      }/${stageMediaData.find(t => t.mediaType === 'MAIN_IMAGE')
                        ?.mediaKey}`
                    : ''
                }
                size={'2xl'}
              />
              <div className="flex flex-col gap-2 md:ml-5 md:mr-6">
                <div className="flex flex-row items-center">
                  <Text
                    className="tracking-wider"
                    intent={'forestGreenTintTwo'}
                    size={'md'}
                    weight={'bold'}
                  >
                    {`STAGE ${stageData?.data.data.number
                      .toString()
                      .padStart(2, '0')} - ${stageData?.data.data
                      .difficultyType}`}
                  </Text>
                </div>
                {stageData && (
                  <div className="flex flex-row gap-4 flex-wrap">
                    <div className="flex xl:flex-row flex-col gap-4">
                      <Heading intent={'h3'}>
                        {`${stageData?.data.data.translations?.find(
                          t => t.localeId === 'en',
                        )
                          ?.stageHead} / ${stageData?.data.data.translations?.find(
                          t => t.localeId === 'en',
                        )?.stageTail}`}
                      </Heading>
                    </div>
                  </div>
                )}
              </div>
              <span className="h-10 flex items-end mr-6">
                {stageData?.data.data.open === true ? (
                  <Label
                    className="text-data-color-16 bg-data-color-14"
                    intent={'active'}
                    postIcon={<Grammerly size={16} variant="Bold" />}
                  >
                    Active
                  </Label>
                ) : (
                  <Label
                    className="text-data-color-7 bg-data-color-13"
                    intent={'inactive'}
                    postIcon={<Grammerly size={16} variant="Bold" />}
                  >
                    Inactive
                  </Label>
                )}
              </span>
            </div>
            <div className="flex md:flex-row flex-col gap-y-3 items-center">
              <div className="md:mr-6 md:w-44 w-full">
                <DateRange
                  asSingle={true}
                  onChange={value => {
                    setDate(value);
                  }}
                  showFooter={false}
                  showShortcuts={false}
                  useRange={false}
                  value={date}
                />
              </div>
              <Button
                className="md:mr-6 md:w-16 w-full"
                intent="secondary"
                onClick={() => {
                  router.push('/trails');
                }}
                size={'md'}
              >
                Back
              </Button>
              <CustomCan a={Subject.Trail} I={UserActions.Update}>
                <Button
                  className="md:w-28 w-full"
                  intent="primary"
                  onClick={() => setShow(true)}
                  size={'md'}
                >
                  Edit trail
                </Button>
              </CustomCan>
            </div>
          </div>
        </div>
        <div className="w-full self-center mt-8 mb-6 flex flex-row">
          <div className="flex sm:flex-row flex-col gap-x-6 justify-between w-full gap-y-3">
            <div className="flex self-center">
              <Heading intent={'h4'}>Users on the trail</Heading>
            </div>
            <div className="flex xl:flex-row flex-col items-center gap-y-3">
              <div className="flex flex-row w-full justify-end">
                <div className="flex mr-4 self-center">
                  <Text size={'md'} weight={'bold'}>
                    Search by
                  </Text>
                </div>
                <div className="xl:mr-6 sm:w-[150px] w-full">
                  <SingleSelect
                    items={fields.map(field => ({
                      id: field.id,
                      name: field.name,
                    }))}
                    placeholderText="Select"
                    tabIndex={value => {
                      handleFieldChange(value.toString());
                    }}
                  />
                </div>
              </div>
              <div className="sm:w-[353px] w-full">
                <InputContainer className="w-full">
                  <Input
                    className="rounded"
                    name="setSearchValue"
                    onChange={event => setSearchValue(event.target.value)}
                    placeholder={'Search'}
                    type="text"
                    value={searchValue}
                  />
                  <Button
                    className={'rounded-none'}
                    intent="secondary"
                    onClick={() => {
                      setIsSearch(true);
                    }}
                    postIcon={<SearchNormal1 size="16" variant="Outline" />}
                    size={'md'}
                  />
                </InputContainer>
              </div>
            </div>
          </div>
        </div>
        {stageUsers?.data.data.data && (
          <DataTable<StageUser>
            columns={columns}
            currentPage={currentPage}
            data={stageUsers?.data.data.data}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        )}
        <EditStageSlideOver
          initialData={stageData?.data?.data as Stage}
          setShow={setShow}
          show={show}
        />
      </div>
    </CustomCan>
  );
};

export default ViewUsersInTrail;
