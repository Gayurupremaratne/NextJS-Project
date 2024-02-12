import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Heading,
  SingleSelect,
  Text,
} from '@/components/atomic';
import { AddCircle } from 'iconsax-react';
import {
  useAssignBadgeToUser,
  useDeleteAssignBadgeToUser,
  useGetAllBadgesEn,
  useGetBadgeByUserId,
} from '@/hooks/badge/badge';
import { IBadgeEn, IGetUserBadges } from '@/types/badge/badge.type';
import _ from 'lodash';
import { AlertDialog } from '@/components/atomic/Modal';
import { UseParams } from '@/constants/useParams';
import { Form, Formik } from 'formik';
import { assignBadgeToUserValidation } from './assign-badge-to-user-validation';
import miunsIcon from '@/public/images/icons/vuesax-bulk-minus-cirlce.svg';
import Image from 'next/image';
interface AchievementsTabContentProps {
  userId: string; // Add the userId prop
}

const AchievementsTabContent: React.FC<AchievementsTabContentProps> = ({
  userId,
}) => {
  const fetchDataOptions: UseParams = {
    pageNumber: 1,
  };

  const { data: getUserBages, refetch } = useGetBadgeByUserId(userId);
  const badges = useGetAllBadgesEn(fetchDataOptions);

  const [specialBadgesData, setSpecialBadgesData] =
    useState<IGetUserBadges[]>();

  const [stageBadgesData, setStageBadgesData] = useState<IGetUserBadges[]>();

  const [badgesData, setBadgesData] = useState<IBadgeEn[]>([]);
  const [unassignbBadgeData, setUnassignbBadgeData] =
    useState<IGetUserBadges>();

  const [showModal, setShowModal] = useState(false);
  const [showUnAssignBadgeModal, setShowUnAssignBadgeModal] = useState(false);
  const [added, setAdded] = useState(false);

  const assignBadgeToUser = useAssignBadgeToUser();
  const deleteAssignBadge = useDeleteAssignBadgeToUser();

  useEffect(() => {
    if (getUserBages?.data?.data) {
      const userBadges = getUserBages?.data?.data;

      const manualBadges = userBadges.filter(
        (badge: IGetUserBadges) => badge.badge.type === 'MANUAL',
      );
      if (!_.isEqual(manualBadges, specialBadgesData)) {
        setSpecialBadgesData(manualBadges);
      }

      const stageBadges = userBadges.filter(
        (badge: IGetUserBadges) => badge.badge.type === 'STAGE_COMPLETION',
      );
      if (!_.isEqual(stageBadges, stageBadgesData)) {
        setStageBadgesData(stageBadges);
      }
    }
    if (added === true) {
      refetch();
      setAdded(false);
    }
  }, [getUserBages, specialBadgesData, stageBadgesData, added]);

  useEffect(() => {
    if (badges.data?.data) {
      const maunalBadgesData = badges.data?.data.filter(
        (badge: IBadgeEn) => badge.type === 'MANUAL',
      );
      if (!_.isEqual(maunalBadgesData, badgesData)) {
        setBadgesData(maunalBadgesData);
      }
    }
  }, [badges]);

  const handleAssignManualBadges = async (badgeId: string) => {
    const response = await assignBadgeToUser.mutateAsync({
      badgeId: badgeId,
      userId,
    });
    if (response.status === 201) {
      setShowModal(false);
      setAdded(true);
    }
  };

  const handleOnClick = (data: IGetUserBadges) => {
    setUnassignbBadgeData(data);
    setShowUnAssignBadgeModal(true);
  };

  const handleDelete = async (id: string) => {
    const response = await deleteAssignBadge.mutateAsync(id);
    if (response?.status === 200) {
      setShowUnAssignBadgeModal(false);
      setAdded(true);
    }
  };

  return (
    <div className="flex flex-col pt-4 w-full pb-10">
      <div className="grid md:grid-cols-3 md:gap-x-10 sm:gap-y-0 gap-y-6">
        <div className="flex flex-col gap-6 mr-8">
          <Text size={'md'}>Special</Text>
          <div className="flex flex-col gap-10">
            <div className="flex flex-row gap-4 flex-wrap">
              {specialBadgesData?.map(badge => (
                <div className="flex flex-row gap-4" key={badge.id}>
                  <Avatar
                    alt={'alt'}
                    imageUrl={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${badge.badge.badgeKey}`}
                    size={'xl'}
                  />
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <Heading intent={'h5'}>
                        {
                          badge.badge.badgeTranslation.find(
                            t => t.localeId === 'en',
                          )?.name
                        }
                      </Heading>
                      <Text className={'max-w-xs'}>
                        {
                          badge.badge.badgeTranslation.find(
                            t => t.localeId === 'en',
                          )?.description
                        }
                      </Text>
                      <Button
                        className="self-start"
                        id="deleteButton"
                        intent={'dangerGhost'}
                        onClick={() => {
                          handleOnClick(badge);
                        }}
                        preIcon={
                          <Image
                            alt="close"
                            className="mr-2"
                            height={16}
                            src={miunsIcon}
                            width={16}
                          />
                        }
                        size={'ghost'}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {specialBadgesData?.length === 0 && (
                <Text intent={'grey'}>No badges to display</Text>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 sm:justify-self-end justify-start">
          <Text size={'md'}>Stage-wise</Text>
          <div className={'flex flex-col gap-10'}>
            <div className="flex flex-row gap-4 flex-wrap">
              {stageBadgesData?.map(badge => (
                <div className="flex flex-row gap-4" key={badge.id}>
                  <Avatar
                    alt={'alt'}
                    imageUrl={`${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${badge.badge.badgeKey}`}
                    size={'xl'}
                  />
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <Heading intent={'h5'}>
                        {
                          badge.badge.badgeTranslation.find(
                            t => t.localeId === 'en',
                          )?.name
                        }
                      </Heading>
                      <Text className={'max-w-xs'}>
                        {
                          badge.badge.badgeTranslation.find(
                            t => t.localeId === 'en',
                          )?.description
                        }
                      </Text>
                    </div>
                  </div>
                </div>
              ))}
              {stageBadgesData?.length === 0 && (
                <Text intent={'grey'}>No badges to display</Text>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-self-end">
          <Button
            intent={'ghost'}
            onClick={() => {
              setShowModal(true);
            }}
            preIcon={<AddCircle className="mr-2" size={16} variant="Bold" />}
            size={'ghost'}
          >
            Assign a badge
          </Button>
          <Formik
            initialValues={{
              badgeId: '',
            }}
            onSubmit={(values, actions) => {
              handleAssignManualBadges(values.badgeId);
              actions.resetForm();
              setAdded(false);
            }}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={assignBadgeToUserValidation(
              specialBadgesData || [],
            )}
          >
            {({ handleSubmit, handleChange, errors, touched }) => (
              <AlertDialog
                buttonCount={1}
                buttonFunction={handleSubmit}
                buttontText="Update badges"
                key={'assignBadge'}
                modalTitle="Assign a badge"
                setShow={value => setShowModal(value)}
                show={showModal}
              >
                <Form>
                  <Text
                    className="mb-2"
                    intent={'dark'}
                    size={'sm'}
                    weight={'semiBold'}
                  >
                    Badges
                  </Text>
                  <SingleSelect
                    className="overflow-y-auto max-h-20"
                    items={badgesData.map(badge => ({
                      id: badge.id!,
                      name: badge.name,
                    }))}
                    placeholderText="Select a badge"
                    tabIndex={value => {
                      handleChange({
                        target: {
                          name: 'badgeId',
                          value: value,
                        },
                      });
                    }}
                  />
                  <Text intent="red" size="xs" type="p">
                    {errors.badgeId && touched.badgeId && errors.badgeId}
                  </Text>
                </Form>
              </AlertDialog>
            )}
          </Formik>
        </div>
      </div>
      <AlertDialog
        buttonFunction={() => {
          handleDelete(
            typeof unassignbBadgeData?.id !== 'undefined'
              ? unassignbBadgeData?.id
              : '',
          );
        }}
        buttontText="Delete"
        modalTitle="Delete badge"
        setShow={value => setShowUnAssignBadgeModal(value)}
        show={showUnAssignBadgeModal}
      >
        <Heading intent={'h6'}>
          {`Are you sure you want to delete "${unassignbBadgeData?.badge.badgeTranslation.find(
            t => t.localeId === 'en',
          )?.name}"?`}
        </Heading>
        <Text
          className="text-tints-battleship-grey-tint-3 mt-2"
          size={'sm'}
          weight={'normal'}
        >
          {
            'You cannot undo this action. All text and information associated with this badge will be permanently deleted.'
          }
        </Text>
      </AlertDialog>
    </div>
  );
};

export default AchievementsTabContent;
