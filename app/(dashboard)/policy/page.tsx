'use client';

import {
  Button,
  DataTable,
  Heading,
  RadioButton,
  Tabs,
  Text,
} from '@/components/atomic';
import { GroupForm } from '@/components/policy-form/GroupForm';
import SlideOver from '@/components/atomic/SlideOver/SlideOver';
import CustomCan from '@/components/casl/CustomCan';
import { PolicyForm } from '@/components/policy-form/PolicyForm';
import { FormActions } from '@/constants/form-actions';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useGetPolicies } from '@/hooks/policy/policy';
import { IPolicy } from '@/types/policy/policy.type';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { columns } from './policyColumns';

import groupPolicyImage from '/public/images/group-policy.png';
import singlePolicyImage from '/public/images/single-policy.png';
import _ from 'lodash';

const ViewAllPolicies = () => {
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, _setTotalPages] = useState<number>(0);

  const [singlePolicy, setSinglePolicy] = useState(false);
  const [groupPolicy, setGroupPolicy] = useState(false);
  const [tab, setTabIndex] = useState<number>(0);

  const { data, refetch } = useGetPolicies();

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage + 1);
  };

  const filteredPolicies = data?.filter(
    policies => policies.parentPolicyId === null,
  );
  useEffect(() => {
    if (!show) {
      setSinglePolicy(false);
      setGroupPolicy(false);
      setTabIndex(0);
    }
  }, [show]);

  useEffect(() => {
    refetch();
  }, [currentPage]);

  const selectPolicyType = () => {
    return (
      <div className="mt-[33px]">
        <div className="flex gap-x-14 w-full">
          <div className="flex flex-col gap-3 w-[448px]">
            <RadioButton
              checked={singlePolicy}
              className={'font-medium'}
              label={'Single policy'}
              onChange={() => {
                setSinglePolicy(true);
                setGroupPolicy(false);
              }}
            />
            <Text size={'sm'}>
              Will appear as an individual option on the user profile. Pressing
              this will take the user directly to the detailed policy screen.
            </Text>
            <Image
              alt="close"
              className="mt-[49px]"
              height={462}
              src={singlePolicyImage}
              width={448}
            />
          </div>
          <div className="flex flex-col gap-3 w-[448px]">
            <RadioButton
              checked={groupPolicy}
              className={'font-medium'}
              label={'Group policy'}
              onChange={() => {
                setGroupPolicy(true);
                setSinglePolicy(false);
              }}
            />

            <Text size={'sm'}>
              Will appear as a parent policy on the user profile which can have
              multiple child policies nested within it. Define parent and child
              policies on the next screen.
            </Text>
            <Image
              alt="close"
              className="mt-[30px]"
              height={462}
              src={groupPolicyImage}
              width={448}
            />
          </div>
        </div>
        <div className="flex justify-end mt-10 mb-10">
          <Button
            isSubmitting={!singlePolicy && !groupPolicy}
            onClick={() => {
              setTabIndex(1);
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  };

  const renderForm = () => {
    return (
      <>
        {singlePolicy ? (
          <PolicyForm action={FormActions.ADD} setSlideOver={setShow} />
        ) : (
          <GroupForm action={FormActions.ADD} setSlideOver={setShow} />
        )}
      </>
    );
  };

  const tabData = [
    {
      title: '01. Setup policy type',
      content: selectPolicyType(),
    },
    {
      title: '02. Add policy information',
      content: renderForm(),
    },
  ];

  return (
    <CustomCan
      a={Subject.PoliciesAndConditions}
      I={UserActions.Read}
      isForbidden={true}
    >
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex lg:flex-row flex-col justify-between gap-3 lg:gap-0">
          <div className="flex flex-col gap-2 w-full lg:w-60 xl:w-96">
            <Heading intent={'h3'}>Policies ({data?.length})</Heading>
            <Text
              className="text-tints-battleship-grey-tint-2"
              size={'md'}
              weight={'medium'}
            >
              Overview of all policies
            </Text>
          </div>
          <div className="flex lg:flex-row flex-col h-fit gap-4 lg:gap-0 self-start">
            <CustomCan a={Subject.PoliciesAndConditions} I={UserActions.Create}>
              <Button
                intent="primary"
                onClick={() => setShow(!show)}
                size={'md'}
              >
                Create new policy
              </Button>
            </CustomCan>
          </div>
        </div>
        {data && (
          <DataTable<IPolicy>
            columns={columns}
            currentPage={currentPage}
            data={filteredPolicies as IPolicy[]}
            isSortEnabled={false}
            onPageChange={handlePageChange}
            setSortBy={() => {}}
            totalPages={totalPages}
          />
        )}
      </div>
      <SlideOver
        setShow={value => setShow(value)}
        show={show}
        title="Create new policy"
      >
        <Tabs
          initialSelected={tab}
          intent="Secondary"
          tabData={tabData}
          tabIndex={e => {
            setTabIndex(e);
          }}
        />
      </SlideOver>
    </CustomCan>
  );
};

export default ViewAllPolicies;
