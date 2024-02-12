import React, { useEffect } from 'react';
import { FormikProps } from 'formik';
import {
  UserImageData,
  UserPayload,
  UserResponse,
} from '@/types/user/user.type';
import {
  Input,
  InputContainer,
  SingleSelect,
  Text,
  UserProfileImage,
} from '@/components/atomic';
import { FormActions } from '@/constants/form-actions';
import { DateRange } from '../atomic/DateRange';
import { DateValueType } from '../atomic/DateRange/types';
import { RoleResponse } from '@/types/role/role.type';
import { UserContactInfo } from './UserContactInfo';

interface Props {
  action?: FormActions;
  profileImageKey?: string;
  loggedInUserId?: string;
  formik: FormikProps<UserPayload>;
  formikAttachment: FormikProps<UserImageData>;
  setProfileImageKey: (value: string | undefined) => void;
  setShowError: (value: boolean) => void;
  setSelectedCountryForCode: (value: string) => void;
  selectedCountryForCode?: string;
  setCountryCode: (value: string) => void;
  userData?: UserResponse;
  setDate: (value: DateValueType) => void;
  date: DateValueType;
  roles?: RoleResponse[];
  setSelectedRole: (value: string) => void;
}

export const GeneralUserInfo = ({
  action,
  profileImageKey,
  formik,
  formikAttachment,
  setProfileImageKey,
  setShowError,
  setSelectedCountryForCode,
  selectedCountryForCode,
  setCountryCode,
  userData,
  setDate,
  date,
  roles,
  setSelectedRole,
  loggedInUserId,
}: Props) => {
  const containerClass =
    typeof action === 'undefined' ? 'min-w-full' : 'w-full';
  const subContainerClass =
    typeof action === 'undefined' ? 'md:gap-y-0 gap-y-2' : 'md:mr-32 lg:w-4/5';
  const shouldRenderRoleSection =
    (action === FormActions.EDIT && loggedInUserId !== userData?.id) ||
    action === FormActions.ADD;

  useEffect(() => {
    if (loggedInUserId === userData?.id) {
      formik.handleChange({
        target: {
          name: 'role_id',
          value: userData?.role.id.toString() as string,
        },
      });
    }
  }, [loggedInUserId, userData]);

  return (
    <>
      <div className="flex flex-row flex-wrap gap-x-8 mt-8">
        <UserProfileImage
          formik={formik}
          formikAttachment={formikAttachment}
          profileImageKey={profileImageKey}
          setProfileImageKey={setProfileImageKey}
          setShowError={setShowError}
        />
      </div>
      <div className={`flex flex-col mt-10 ${containerClass}`}>
        <div
          className={`grid md:grid-cols-3 md:gap-x-5 ${subContainerClass} w-full`}
        >
          <div className="flex flex-col gap-2">
            <Text
              className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red"
              intent={'dark'}
              size={'sm'}
              weight={'normal'}
            >
              First name
            </Text>
            <InputContainer
              className="w-69"
              error={
                formik.errors.firstName && formik.touched.firstName
                  ? [formik.errors.firstName]
                  : undefined
              }
            >
              <Input
                name="firstName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder={'Vincent'}
                type="text"
                value={formik.values.firstName}
              />
            </InputContainer>
          </div>
          <div className="flex flex-col gap-2">
            <Text
              className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red"
              intent={'dark'}
              size={'sm'}
              weight={'normal'}
            >
              Last name
            </Text>
            <InputContainer
              error={
                formik.errors.lastName && formik.touched.lastName
                  ? [formik.errors.lastName]
                  : undefined
              }
            >
              <Input
                name="lastName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder={'Fabron'}
                type="text"
                value={formik.values.lastName}
              />
            </InputContainer>
          </div>
          <div className="flex flex-col gap-2">
            <Text
              className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red"
              intent={'dark'}
              size={'sm'}
              weight={'normal'}
            >
              Email address
            </Text>
            <InputContainer
              disabled={
                action === FormActions.EDIT || typeof action === 'undefined'
              }
              error={
                formik.errors.email && formik.touched.email
                  ? [formik.errors.email]
                  : undefined
              }
            >
              <Input
                disabled={
                  action === FormActions.EDIT || typeof action === 'undefined'
                }
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder={'vincentfabron@gmail.com'}
                type="email"
                value={formik.values.email}
              />
            </InputContainer>
          </div>
        </div>
      </div>
      <UserContactInfo
        action={action}
        formik={formik}
        selectedCountryForCode={selectedCountryForCode}
        setCountryCode={setCountryCode}
        setSelectedCountryForCode={setSelectedCountryForCode}
      />
      <div className={`flex flex-col mt-5 ${containerClass}`}>
        <div
          className={`grid md:grid-cols-3 md:gap-x-5 ${subContainerClass} w-full`}
        >
          <div className="flex flex-col gap-2">
            <Text
              className="text-tints-battleship-black-tint-2"
              size={'sm'}
              weight={'normal'}
            >
              Passport/Identity
            </Text>
            {formik.values.nationalityCode === 'LK' ? (
              <InputContainer
                error={
                  formik.errors.nicNumber
                    ? [formik.errors.nicNumber]
                    : undefined
                }
              >
                <Input
                  name="nicNumber"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={'31195855'}
                  type="text"
                  value={formik.values.nicNumber as string}
                />
              </InputContainer>
            ) : (
              <InputContainer
                error={
                  formik.errors.passportNumber
                    ? [formik.errors.passportNumber]
                    : undefined
                }
              >
                <Input
                  name="passportNumber"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  placeholder={'31195855'}
                  type="text"
                  value={formik.values.passportNumber as string}
                />
              </InputContainer>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Text
              className="text-tints-battleship-black-tint-2"
              size={'sm'}
              weight={'normal'}
            >
              Date of birth
            </Text>
            <DateRange
              asSingle={true}
              maxDate={new Date()}
              onChange={value => {
                setDate(value);
                formik.handleChange({
                  target: {
                    name: 'dateOfBirth',
                    value: value?.startDate === null ? '' : value?.startDate,
                  },
                });
              }}
              showFooter={false}
              showShortcuts={false}
              useRange={false}
              value={date}
            />
            <Text intent="red" size="xs" type="p">
              {formik.errors.dateOfBirth &&
                formik.touched.dateOfBirth &&
                formik.errors.dateOfBirth}
            </Text>
          </div>
          {shouldRenderRoleSection && (
            <div className="flex flex-col gap-0">
              <Text
                className="text-tints-battleship-black-tint-6 after:content-['*'] after:ml-0.5 after:text-red mb-2"
                size={'sm'}
                weight={'normal'}
              >
                Role
              </Text>
              <SingleSelect
                initialSelected={
                  userData?.role && {
                    id: userData.role.id,
                    name: userData.role.name,
                  }
                }
                items={
                  roles?.map(role => ({
                    id: role.id,
                    name: role.name,
                  })) ?? []
                }
                placeholderText="Hiker"
                tabIndex={value => {
                  setSelectedRole(value.toString());
                  formik.handleChange({
                    target: {
                      name: 'role_id',
                      value: value,
                    },
                  });
                }}
              />
              <Text intent="red" size="xs" type="p">
                {formik.errors.role_id &&
                  formik.touched.role_id &&
                  formik.errors.role_id}
              </Text>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
