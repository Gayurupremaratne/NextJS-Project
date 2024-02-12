import { Button, Input, InputContainer, Text } from '@/components/atomic';
import { FormikProps, useFormik } from 'formik';
import ReactFlagsSelect from 'react-flags-select';
import 'react-phone-input-2/lib/style.css';
import 'react-phone-number-input/style.css';
import PhoneInput, {
  Country,
  getCountryCallingCode,
} from 'react-phone-number-input';
import { DateValueType } from '../atomic/DateRange/types';
import React, { useEffect, useState } from 'react';
import { useGetAllRoles } from '@/hooks/role/role';
import { RoleResponse } from '@/types/role/role.type';
import {
  UserImageData,
  UserPayload,
  UserResponse,
} from '@/types/user/user.type';
import { Snackbar } from '../atomic/Snackbar/Snackbar';
import { formatDate } from '../atomic/DateRange/helpers/DateFormatter';
import { EmergencyContactResponse } from '@/types/emergencyContact/emergencyContact.type';
import { useCreateUser, useGetMe, useUpdateUser } from '@/hooks/user/user';
import { useUpdateEmergencyContact } from '@/hooks/emergencyContact/emergencyContact';
import { FormActions } from '@/constants/form-actions';
import { isAxiosError } from 'axios';
import { createUserValidation } from './create-user-validation';
import CustomCountrySelect from '../atomic/CustomCountrySelectCode/CustomCountrySelectCode';
import customInputComponentWithSetCountryCode from '../atomic/CustomInputCountryInputCodeSelect/CustomInputCountryCodeSelect';
import { GeneralUserInfo } from './GeneralUserInfo';
import _ from 'lodash';

type UserFormProps = {
  action: FormActions;
  userId?: string;
  userData?: UserResponse;
  userImageData?: UserImageData;
  emergencyContactData?: EmergencyContactResponse;
  setEditShow: (value: boolean) => void;
};

const UserForm: React.FC<UserFormProps> = ({
  action,
  userId,
  userData,
  userImageData,
  emergencyContactData,
  setEditShow,
}) => {
  const { data: loggedInUserData } = useGetMe();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const updateUserEmergencyContact = useUpdateEmergencyContact(userId ?? '');

  const { data: allRoles } = useGetAllRoles({
    pageNumber: 1,
    search: '',
    perPage: 10,
    sortBy: '',
  });

  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [selectedRole, setSelectedRole] = useState('');

  const [selectedCountryForCode, setSelectedCountryForCode] =
    useState<string>();
  const [
    selectedCountryCodeEmergencyContact,
    setSelectedCountryCodeEmergencyContact,
  ] = useState<string>();

  const [countryCode, setCountryCode] = useState('');
  const [countryCodeEmergencyContact, setCountryCodeEmergencyContact] =
    useState('');

  const [profileImageKey, setProfileImageKey] = useState(
    userData?.profileImageKey ?? userImageData?.profileImageKey,
  );
  const [showError, setShowError] = useState<boolean>();
  const [date, setDate] = useState<DateValueType>({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (userData) {
      setSelectedCountryForCode(userData.contactNumberNationalityCode);
      setSelectedCountryCodeEmergencyContact(
        emergencyContactData?.contactNumberNationalityCode,
      );
      setDate({
        startDate:
          userData?.dateOfBirth?.toString() === null
            ? ''
            : formatDate(userData?.dateOfBirth?.toString()),
        endDate:
          userData?.dateOfBirth?.toString() === null
            ? ''
            : formatDate(userData?.dateOfBirth?.toString()),
      });
      setSelectedRole(userData?.role.id.toString());
    }
  }, [userData]);

  const getInitialData = () => {
    const initialData = {
      firstName: userData?.firstName ?? '',
      lastName: userData?.lastName ?? '',
      email: userData?.email ?? '',
      nationalityCode: userData?.nationalityCode ?? 'FR',
      countryCode: userData?.countryCode ?? countryCode,
      contactNumber: !_.isNil(userData?.contactNumber)
        ? `${userData?.contactNumber?.replace(/^0/, '')}`
        : '',
      passportNumber: userData?.passportNumber ?? '',
      nicNumber: userData?.nicNumber ?? '',
      dateOfBirth: userData?.dateOfBirth === null ? '' : userData?.dateOfBirth,
      profileImageKey: userData?.profileImageKey,
      preferredLocaleId: 'en',
      role_id: selectedRole,
      emergencyContactNumber: !_.isNil(emergencyContactData?.contactNumber)
        ? `${emergencyContactData?.contactNumber?.replace(/^0/, '')}`
        : '',
      emergencyContactFullName: emergencyContactData?.name ?? '',
      emergencyContactCountryCode:
        emergencyContactData?.countryCode ?? countryCodeEmergencyContact,
      emergencyContactNumberNationalityCode:
        emergencyContactData?.contactNumberNationalityCode ?? '',
      emergencyContactRelationship: emergencyContactData?.relationship ?? '',
      image: userImageData?.image,
    };
    return initialData;
  };

  useEffect(() => {
    if (allRoles) {
      setRoles(allRoles?.data.data.data);
    }
  }, [allRoles]);

  const setPassportNumberString = (value: string, nationalityCode: string) => {
    if (value === '' || nationalityCode === 'LK') {
      return null;
    }
    return value;
  };

  const handleCreateUser = async (values: UserPayload) => {
    return createUser.mutateAsync({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      nationalityCode: values.nationalityCode,
      role_id: values.role_id === '0' ? undefined : values.role_id,
      dateOfBirth:
        values.dateOfBirth === '' ? undefined : values.dateOfBirth?.toString(),
      passportNumber: setPassportNumberString(
        values.passportNumber as string,
        values.nationalityCode,
      ),
      nicNumber:
        values.nicNumber === '' || values.nationalityCode !== 'LK'
          ? null
          : values.nicNumber,
      profileImageKey: profileImageKey,
      preferredLocaleId: values.preferredLocaleId,
      countryCode: (values.contactNumber as string) === '' ? null : countryCode,
      emergencyContactFullName: values.emergencyContactFullName,
      emergencyContactRelationship: values.emergencyContactRelationship,
      emergencyContactCountryCode: countryCodeEmergencyContact,
      contactNumber:
        (values.contactNumber as string) === ''
          ? null
          : (values.contactNumber as string).replaceAll(' ', ''),
      emergencyContactNumber: values.emergencyContactNumber.replaceAll(' ', ''),
      contactNumberNationalityCode:
        (values.contactNumber as string) === ''
          ? null
          : selectedCountryForCode ?? values.nationalityCode,
      emergencyContactNumberNationalityCode:
        selectedCountryCodeEmergencyContact ?? values.nationalityCode,
    });
  };

  const handleEditUser = async (values: UserPayload) => {
    const countryCodeNew =
      (values.contactNumber as string) === '' ? null : countryCode;
    const contactNumber =
      (values.contactNumber as string) === ''
        ? null
        : (values.contactNumber as string).replaceAll(' ', '');
    const passportNumber = setPassportNumberString(
      values.passportNumber as string,
      values.nationalityCode,
    );
    const nicNumber =
      values.nicNumber === '' || values.nationalityCode !== 'LK'
        ? null
        : values.nicNumber;
    const dateOfBirth =
      values.dateOfBirth === '' ? null : values.dateOfBirth?.toString();
    const profileImageKeyNew =
      typeof profileImageKey !== 'undefined' ? profileImageKey : null;

    const responseUser = await updateUser.mutateAsync({
      id: userId ?? '',
      firstName: values.firstName ?? '',
      lastName: values.lastName ?? '',
      email: values.email ?? '',
      nationalityCode: values.nationalityCode ?? '',
      countryCode: countryCodeNew,
      contactNumber,
      passportNumber,
      nicNumber,
      dateOfBirth,
      profileImageKey: profileImageKeyNew,
      preferredLocaleId: values.preferredLocaleId,
      role_id: values.role_id,
      contactNumberNationalityCode:
        (values.contactNumber as string) === ''
          ? null
          : selectedCountryForCode ?? values.nationalityCode,
    });

    if (responseUser.status === 200) {
      setEditShow(false);
    } else {
      setShowError(true);
    }
  };

  const handleEditEmergencyContact = async (values: UserPayload) => {
    await updateUserEmergencyContact.mutateAsync({
      userId: userId ?? '',
      contactNumber:
        values.emergencyContactNumber === ''
          ? null
          : values.emergencyContactNumber.replaceAll(' ', ''),
      name: values.emergencyContactFullName || null,
      countryCode:
        values.emergencyContactNumber === ''
          ? null
          : countryCodeEmergencyContact,
      relationship: values.emergencyContactRelationship || null,
      contactNumberNationalityCode:
        values.emergencyContactNumber === ''
          ? null
          : selectedCountryCodeEmergencyContact ?? values.nationalityCode,
    });
  };

  const formik = useFormik({
    initialValues: getInitialData(),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);

      if (action === FormActions.ADD) {
        try {
          const response = await handleCreateUser(values as UserPayload);
          if (response.status === 201) {
            setEditShow(false);
            return;
          }
          setShowError(true);
        } catch (error) {
          if (isAxiosError(error)) {
            if (
              error.response?.status === 422 &&
              error.response.data.message.email
            ) {
              formik.setFieldError('email', 'Email is already in use');
              return;
            }
            setShowError(true);
            return;
          }
          setShowError(true);
        }
      }

      if (action === FormActions.EDIT && userData) {
        await handleEditUser(values as UserPayload);
        await handleEditEmergencyContact(values as UserPayload);
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: createUserValidation(),
  });

  return (
    <div>
      <Snackbar
        intent="error"
        show={showError as boolean}
        snackContent={'Something went wrong, please try again'}
      />
      <Text
        className="tracking-wide"
        intent={'green'}
        size={'xs'}
        weight={'bold'}
      >
        PERSONAL INFORMATION
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <GeneralUserInfo
          action={action}
          date={date}
          formik={formik as unknown as FormikProps<UserPayload>}
          formikAttachment={formik as unknown as FormikProps<UserImageData>}
          loggedInUserId={loggedInUserData?.data.apiData.id.toString()}
          profileImageKey={profileImageKey}
          roles={roles}
          selectedCountryForCode={selectedCountryForCode}
          setCountryCode={setCountryCode}
          setDate={setDate}
          setProfileImageKey={setProfileImageKey}
          setSelectedCountryForCode={setSelectedCountryForCode}
          setSelectedRole={setSelectedRole}
          setShowError={setShowError}
          userData={userData}
        />
        <hr className="flex border-dashed border  border-tints-battleship-grey-tint-5 my-4 mt-8" />
        <div className="mt-8">
          <Text
            className="tracking-wide"
            intent={'green'}
            size={'xs'}
            weight={'bold'}
          >
            EMERGENCY CONTACT INFORMATION
          </Text>
        </div>
        <div className="flex flex-col mt-6">
          <div className="grid md:grid-cols-3 md:gap-x-5 md:mr-32 lg:w-4/5 w-full">
            <div className="flex flex-col gap-2">
              <Text
                className="text-tints-battleship-black-tint-2"
                size={'sm'}
                weight={'normal'}
              >
                Full name
              </Text>
              <InputContainer
                error={
                  formik.errors.emergencyContactFullName &&
                  formik.touched.emergencyContactFullName
                    ? [formik.errors.emergencyContactFullName]
                    : undefined
                }
              >
                <Input
                  name="emergencyContactFullName"
                  onBlur={formik.handleBlur}
                  onChange={e => {
                    const newValue = e.target.value;
                    formik.handleChange({
                      target: {
                        name: 'emergencyContactFullName',
                        value: newValue,
                      },
                    });
                  }}
                  placeholder={'Richard Fabron'}
                  type="text"
                  value={formik.values.emergencyContactFullName}
                />
              </InputContainer>
            </div>
            <div className="flex flex-col gap-2">
              <Text
                className="text-tints-battleship-black-tint-2"
                size={'sm'}
                weight={'normal'}
              >
                Country code
              </Text>
              <div className="w-full">
                <InputContainer>
                  <ReactFlagsSelect
                    className="rounded-[5px] border-1 border-red text-shades-battleship-grey-shade-6 font-sm font-albertSans font-normal focus:outline-none h-[42px] pt-0.5"
                    fullWidth={false}
                    id="countryCodeSelect"
                    onSelect={country => {
                      setSelectedCountryCodeEmergencyContact(country);
                      const value = getCountryCallingCode(country as Country);
                      formik.handleChange({
                        target: {
                          name: 'emergencyContactCountryCode',
                          value: `+${value}`,
                        },
                      });
                    }}
                    searchable={true}
                    selected={
                      selectedCountryCodeEmergencyContact ??
                      formik.values.nationalityCode
                    }
                    showSelectedLabel={false}
                  />
                  <PhoneInput
                    countrySelectComponent={CustomCountrySelect}
                    defaultCountry={
                      (selectedCountryCodeEmergencyContact ??
                        formik.values.nationalityCode) as Country
                    }
                    disabled={true}
                    inputComponent={customInputComponentWithSetCountryCode(
                      setCountryCodeEmergencyContact,
                    )}
                    international
                    name="countryCode"
                    onChange={formik.handleChange}
                    readOnly={true}
                  />
                </InputContainer>
              </div>
              <Text intent="red" size="xs" type="p">
                {formik.errors.emergencyContactCountryCode &&
                  formik.touched.emergencyContactCountryCode &&
                  formik.errors.emergencyContactCountryCode}
              </Text>
            </div>
            <div className="flex flex-col gap-2">
              <Text
                className="text-tints-battleship-black-tint-6"
                size={'sm'}
                weight={'normal'}
              >
                Contact number
              </Text>
              <div className="h-11 w-full flex flex-row items-stretch rounded-[5px] border border-solid border-tints-battleship-grey-tint-5 hover:border-tints-forest-green-tint-2 focus:border-tints-forest-green-tint-1 ">
                <Input
                  className="h-full rounded-[5px] border-none focus:outline-none pl-3 w-full"
                  name="emergencyContactNumber"
                  onBlur={formik.handleBlur}
                  onChange={value => {
                    formik.handleChange({
                      target: {
                        name: 'emergencyContactNumber',
                        value:
                          typeof value === 'undefined'
                            ? ''
                            : value.target.value,
                      },
                    });
                  }}
                  placeholder="798926369"
                  value={formik.values.emergencyContactNumber}
                />
              </div>
              <Text intent="red" size="xs" type="p">
                {formik.errors.emergencyContactNumber &&
                  formik.touched.emergencyContactNumber &&
                  formik.errors.emergencyContactNumber}
              </Text>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-5">
          <div className="grid md:grid-cols-3 md:gap-x-5 md:mr-32 lg:w-4/5 w-full">
            <div className="flex flex-col gap-2">
              <Text
                className="text-tints-battleship-black-tint-2"
                size={'sm'}
                weight={'normal'}
              >
                Relationship
              </Text>
              <InputContainer
                error={
                  formik.errors.emergencyContactRelationship &&
                  formik.touched.emergencyContactRelationship
                    ? [formik.errors.emergencyContactRelationship]
                    : undefined
                }
              >
                <Input
                  name="emergencyContactRelationship"
                  onBlur={formik.handleBlur}
                  onChange={e => {
                    const newValue = e.target.value;
                    formik.handleChange({
                      target: {
                        name: 'emergencyContactRelationship',
                        value: newValue,
                      },
                    });
                  }}
                  placeholder={'Father'}
                  type="text"
                  value={formik.values.emergencyContactRelationship}
                />
              </InputContainer>
            </div>
          </div>
        </div>
        <div className="flex flex-row w-full justify-end mt-4 mb-11">
          <div>
            <Button
              className="h-9.75 w-full justify-center"
              loading={
                action === FormActions.ADD
                  ? createUser.isLoading
                  : updateUser.isLoading
              }
              size={'md'}
              type="submit"
            >
              {' '}
              <span className="m-auto">
                {action === FormActions.ADD ? 'Create user' : 'Save changes'}
              </span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
