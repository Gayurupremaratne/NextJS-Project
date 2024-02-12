'use client';

import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Heading,
  Label,
  SingleSelect,
  Tabs,
  Text,
} from '@/components/atomic';
import { Grammerly } from 'iconsax-react';
import AchievementsTabContent from './AchievementsTabData';
import PassesTabContent from './passesTabData';
import StagesTabContent from './StagesTabData';
import { Card } from '@/components/atomic/Card';
import { useGetUser, useGetUserTrailTrackingSummary } from '@/hooks/user/user';
import { useRouter } from 'next/navigation';
import { UserResponse, UserTrailTrackingSummary } from '@/types/user/user.type';
import { useGetBadgeByUserId } from '@/hooks/badge/badge';
import countryCodes, { CountryProperty } from 'country-codes-list';
import { useGetEmergencyContacts } from '@/hooks/emergencyContact/emergencyContact';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import UserForm from '@/components/user-form/UserForm';
import { FormActions } from '@/constants/form-actions';
import _ from 'lodash';
import { useGetStages } from '@/hooks/stage/stage';
import { StageParams } from '@/constants/stageParams';

interface Props {
  params: {
    id: string;
  };
}

const ViewUser = ({ params }: Props) => {
  const router = useRouter();
  const nationalityCode = 'countryCode' as CountryProperty;
  const fetchDataOptions: StageParams = {
    pageNumber: 1,
    perPage: 10,
  };
  const { data } = useGetStages(fetchDataOptions);
  const [age, setAge] = useState(0);
  const [passesStatus, setPassesStatus] = useState<string | null>();
  const [stagesStatus, setStagesStatus] = useState<string | null>();
  const [country, setCountry] = useState<string>();
  const [tabId, setTabId] = useState(0);
  const [trailSummary, setTrailSummary] = useState<UserTrailTrackingSummary>({
    totalCompletedStages: 0,
    totalDuration: 0,
    totalDistanceTraveled: 0,
    totalStages: 0,
    totalAwardedBadges: 0,
  });
  const [timeOnTrail, setTimeOnTrail] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });
  const [showEditPage, setShowEditPage] = useState(false);
  const [user, setUser] = useState<UserResponse>();

  const convertSecondsToHoursAndMinutesAndSeconds = (
    totalSeconds: number,
  ): { hours: number; minutes: number; seconds: number } => {
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { hours, minutes, seconds };
  };

  const { data: userData, refetch } = useGetUser(params.id);
  const { data: userTrailTrackingSummary } = useGetUserTrailTrackingSummary(
    params.id,
  );
  const { data: getUserBadges } = useGetBadgeByUserId(params.id);
  const { data: getuserEmergencyContact, refetch: refetchEmergencyContacts } =
    useGetEmergencyContacts(params.id);

  useEffect(() => {
    if (userData?.data) {
      if (!_.isEmpty(userData?.data.data.dateOfBirth)) {
        const currentDate = new Date();
        const birthdate = new Date(userData?.data.data.dateOfBirth);

        if (!isNaN(birthdate.getTime())) {
          setAge(
            Math.floor(
              (currentDate.getTime() - birthdate.getTime()) /
                (365 * 24 * 60 * 60 * 1000),
            ),
          );
        }
      }

      setUser(userData?.data.data);

      setCountry(
        countryCodes.findOne(
          nationalityCode,
          userData?.data.data.nationalityCode || '',
        ).countryNameEn,
      );
    }
  }, [userData, refetch]);

  useEffect(() => {
    refetch();
    refetchEmergencyContacts();
  }, [showEditPage]);

  useEffect(() => {
    if (userTrailTrackingSummary?.data.data) {
      setTrailSummary(userTrailTrackingSummary?.data.data?.[0]);

      const totalSeconds =
        userTrailTrackingSummary?.data.data?.[0]?.totalDuration || 0;
      const { hours, minutes, seconds } =
        convertSecondsToHoursAndMinutesAndSeconds(totalSeconds);

      setTimeOnTrail({ hours, minutes, seconds });
    }
  }, [userTrailTrackingSummary]);

  const isInactive = (loginAt: Date) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(loginAt) <= thirtyDaysAgo;
  };

  const getPassesStatus = () => {
    const optionalSelectStage = [
      {
        id: '0',
        name: 'All',
      },
      {
        id: '1',
        name: 'Active',
      },
      {
        id: '2',
        name: 'Expired',
      },
      {
        id: '3',
        name: 'Reserved',
      },
    ];
    return [...optionalSelectStage];
  };

  const getStagesStatus = () => {
    const optionalSelectStage = [
      {
        id: '0',
        name: 'All',
      },
      {
        id: '1',
        name: 'Complete',
      },
      {
        id: '2',
        name: 'Incomplete',
      },
    ];
    return [...optionalSelectStage];
  };

  const handlePassesStatusChange = (e: string) => {
    const statusId = parseInt(e);
    if (statusId == 0) {
      setPassesStatus(null);
    } else if (e == '1') {
      setPassesStatus('active');
    } else if (e == '2') {
      setPassesStatus('expired');
    } else {
      setPassesStatus('reserved');
    }
  };

  const handleStagesStatusChange = (e: string) => {
    const stageId = parseInt(e);
    if (stageId == 0) {
      setStagesStatus(null);
    } else if (e == '1') {
      setStagesStatus('complete');
    } else {
      setStagesStatus('in-complete');
    }
  };

  const handleTabChange = (e: number) => {
    setTabId(e);
  };

  const UserStatus = (loginAt: Date) => {
    const isActive = !isInactive(loginAt);
    return (
      <span>
        {isActive ? (
          <Label
            intent={'active'}
            postIcon={<Grammerly size={16} variant="Bold" />}
          >
            Active
          </Label>
        ) : (
          <Label
            intent={'inactive'}
            postIcon={<Grammerly size={16} variant="Bold" />}
          >
            Inactive
          </Label>
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col w-full gap-10">
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full self-center">
          <div className="flex gap-x-6 lg:justify-between justify-end w-full">
            <div className="flex md:flex-row flex-col justify-between w-full">
              <div className="flex flex-row gap-5">
                <div className="flex">
                  <Avatar
                    alt={'alt'}
                    imageUrl={
                      userData?.data.data.profileImageKey &&
                      `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${userData.data.data.profileImageKey}`
                    }
                    initials={userData?.data?.data.firstName}
                    size={'2xl'}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-4 items-center">
                    <Heading intent={'h3'}>
                      {userData?.data?.data.firstName}{' '}
                      {userData?.data.data.lastName}
                    </Heading>
                    {userData?.data.data.loginAt &&
                      UserStatus(userData.data.data.loginAt)}
                  </div>
                  {userData && (
                    <div className="flex flex-row gap-x-4 gap-y-2 flex-wrap ">
                      <div className="flex flex-row gap-2">
                        <Text intent={'grey'} size={'md'}>
                          Role
                        </Text>
                        <Text size={'md'}>{userData?.data.data.role.name}</Text>
                      </div>
                      <Text intent={'grey'}>●</Text>
                      <div className="flex flex-row gap-2">
                        <Text intent={'grey'} size={'md'}>
                          Age
                        </Text>
                        <Text size={'md'}>{age}</Text>
                      </div>
                      <Text intent={'grey'}>●</Text>
                      <div className="flex flex-row gap-2">
                        <Text intent={'grey'} size={'md'}>
                          Nationality
                        </Text>
                        <Text size={'md'}>{country}</Text>
                      </div>
                      <Text intent={'grey'}>●</Text>
                      <div className="flex flex-row gap-2">
                        <Text intent={'grey'} size={'md'}>
                          Phone
                        </Text>
                        <Text size={'md'}>
                          {userData?.data.data.countryCode &&
                          userData?.data.data.contactNumber
                            ? `(${
                                userData.data.data.countryCode
                              }) ${userData.data.data.contactNumber.replace(
                                /0/g,
                                '',
                              )}`
                            : '-'}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex md:flex-row flex-col md:gap-6 gap-4 pt-4 md:pt-0 md:items-center md:w-64 w-full justify-end">
                <Button
                  intent="secondary"
                  onClick={() => {
                    router.push('/users');
                  }}
                  size={'md'}
                >
                  Back
                </Button>
                <Button
                  intent="primary"
                  onClick={() => {
                    setShowEditPage(true);
                  }}
                  size={'md'}
                >
                  Edit user
                </Button>
              </div>
              <SlideOver
                setShow={setShowEditPage}
                show={showEditPage}
                title="Edit User"
              >
                <UserForm
                  action={FormActions.EDIT}
                  emergencyContactData={getuserEmergencyContact?.data.data}
                  setEditShow={setShowEditPage}
                  userData={user ?? ({} as UserResponse)}
                  userId={params.id}
                />
              </SlideOver>
            </div>
          </div>
        </div>
      </div>
      <div className="flex md:flex-row flex-col gap-4 w-full">
        <Card
          cardDescription={`${
            trailSummary ? trailSummary?.totalCompletedStages : 0
          }/${data?.meta.total}`}
          cardTitle="Stages finished"
        />
        <Card
          cardDescription={`${
            timeOnTrail
              ? timeOnTrail.hours +
                'h:' +
                timeOnTrail.minutes +
                'm:' +
                timeOnTrail.seconds +
                's'
              : '0h'
          }`}
          cardTitle="Time on trail"
        />
        <Card
          cardDescription={`${
            trailSummary ? trailSummary?.totalDistanceTraveled.toFixed(2) : 0
          }km`}
          cardTitle="Distance travelled"
        />
        <Card
          cardDescription={`${
            getUserBadges && getUserBadges.data?.data?.length > 0
              ? getUserBadges?.data.data.length.toString().padStart(2, '0')
              : 0
          }`}
          cardTitle="Badges earned"
        />
      </div>
      <div className="flex flex-row relative">
        <Tabs
          intent="Secondary"
          tabData={[
            {
              title: 'Passes',
              content: (
                <PassesTabContent
                  passesStatus={passesStatus}
                  userId={params.id}
                />
              ),
            },
            {
              title: 'Stages',
              content: (
                <StagesTabContent
                  stagesStatus={stagesStatus}
                  userId={params.id}
                />
              ),
            },
            {
              title: 'Achievements',
              content: <AchievementsTabContent userId={params.id} />,
            },
          ]}
          tabIndex={e => {
            handleTabChange(e);
          }}
        />
        <div className="absolute hidden md:flex right-0">
          {tabId === 0 && (
            <div className="flex items-center min-w-[308px] space-x-2">
              <Text className="w-full text-end">Pass status</Text>
              <SingleSelect
                initialSelected={getPassesStatus().find(
                  pass => pass.id === '0',
                )}
                items={getPassesStatus()}
                tabIndex={e => {
                  handlePassesStatusChange(e as string);
                }}
              />
            </div>
          )}
          {tabId === 1 && (
            <div className="flex items-center min-w-[308px] space-x-2">
              <Text className="w-full text-end">Completion status</Text>
              <SingleSelect
                initialSelected={getStagesStatus().find(
                  stage => stage.id === '0',
                )}
                items={getStagesStatus()}
                tabIndex={e => {
                  handleStagesStatusChange(e as string);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
