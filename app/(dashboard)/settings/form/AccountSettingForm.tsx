'use client';

import { Button, Input, InputContainer, Text } from '@/components/atomic';
import { formatDate } from '@/components/atomic/DateRange/helpers/DateFormatter';
import { Snackbar } from '@/components/atomic/Snackbar/Snackbar';
import {
  UpdateUserPayload,
  UserImageData,
  UserMe,
  UserPayload,
} from '@/types/user/user.type';
import { FormikProps, useFormik } from 'formik';
import 'react-phone-number-input/style.css';
import 'react-phone-input-2/lib/style.css';
import { DateValueType } from '@/components/atomic/DateRange/types';
import { KeySquare } from 'iconsax-react';
import { accountSettingFormValidation } from './AccountSettingFormValidations';
import { useChangePassword, useUpdateUser } from '@/hooks/user/user';
import { useEffect, useState } from 'react';
import { GeneralUserInfo } from '@/components/user-form/GeneralUserInfo';
import { PasswordVisibilityButton } from './PasswordVisibilityButton';

type AccountSettingFormProps = {
  userData: UserMe;
  userImageData?: UserImageData;
  setAccountSettingSuccess: (value: boolean) => void;
};

const AccountSettingForm = ({
  userData,
  userImageData,
  setAccountSettingSuccess,
}: AccountSettingFormProps) => {
  const {
    mutateAsync: updateUser,
    isLoading,
    isError: isUpdateUserError,
  } = useUpdateUser();
  const { mutateAsync: changePassword, isError: isChangePasswordError } =
    useChangePassword();

  const [selectedCountryForCode, setSelectedCountryForCode] = useState(
    userData?.apiData?.contactNumberNationalityCode ?? '',
  );

  const [countryCode, setCountryCode] = useState('');

  const [profileImageKey, setProfileImageKey] = useState(
    userData?.apiData.profileImageKey ?? userImageData?.profileImageKey,
  );
  const [showError, setShowError] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isSuccessChangePassword, setIsSuccessChangePassword] =
    useState<boolean>(false);
  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
  const [date, setDate] = useState<DateValueType>({
    startDate: '',
    endDate: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  };

  const [showNewPassword, setShowNewPassword] = useState(false);
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(prevShowPassword => !prevShowPassword);
  };

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prevShowPassword => !prevShowPassword);
  };

  useEffect(() => {
    setDate({
      startDate:
        userData?.apiData.dateOfBirth?.toString() === null
          ? ''
          : formatDate(userData?.apiData.dateOfBirth?.toString() ?? ''),
      endDate:
        userData?.apiData.dateOfBirth?.toString() === null
          ? ''
          : formatDate(userData?.apiData.dateOfBirth?.toString() ?? ''),
    });
    setSelectedCountryForCode(
      userData?.apiData?.contactNumberNationalityCode ??
        userData?.apiData?.nationalityCode ??
        '',
    );
  }, [userData]);

  const getInitialData = () => {
    const initialData = {
      firstName: userData?.apiData.firstName ?? '',
      lastName: userData?.apiData.lastName ?? '',
      email: userData?.apiData.email ?? '',
      nationalityCode: userData?.apiData.nationalityCode ?? 'FR',
      countryCode:
        userData?.apiData.countryCode === null
          ? undefined
          : userData?.apiData.countryCode,
      contactNumber:
        userData?.apiData.contactNumber !== null
          ? `${userData?.apiData?.contactNumber?.replace(/^0/, '')}`
          : '',
      contactNumberNationalityCode:
        userData?.apiData.contactNumberNationalityCode === null
          ? undefined
          : userData?.apiData.contactNumberNationalityCode,
      passportNumber:
        userData?.apiData.passportNumber === null
          ? ''
          : userData?.apiData.passportNumber,
      nicNumber:
        userData?.apiData.nicNumber === null ? '' : userData?.apiData.nicNumber,
      dateOfBirth:
        userData?.apiData.dateOfBirth === null
          ? ''
          : formatDate(userData?.apiData.dateOfBirth?.toString() ?? ''),
      profileImageKey: userData?.apiData.profileImageKey,
      preferredLocaleId: 'en',
      image: userImageData?.image,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    return initialData;
  };

  const handleUpdateUser = async (values: UpdateUserPayload) => {
    return updateUser({
      id: values.id,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      nationalityCode: values.nationalityCode,
      countryCode: values.contactNumber === '' ? null : countryCode,
      contactNumberNationalityCode:
        values.contactNumber === ''
          ? null
          : selectedCountryForCode ?? values.nationalityCode,
      contactNumber:
        values.contactNumber === ''
          ? null
          : values?.contactNumber?.replaceAll(' ', ''),
      passportNumber:
        values.passportNumber === '' || values.nationalityCode === 'LK'
          ? null
          : values.passportNumber,
      nicNumber:
        values.nicNumber === '' || values.nationalityCode !== 'LK'
          ? null
          : values.nicNumber,
      dateOfBirth: values.dateOfBirth === '' ? null : values.dateOfBirth,
      profileImageKey:
        typeof profileImageKey !== 'undefined' ? profileImageKey : null,
      preferredLocaleId: values.preferredLocaleId,
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialData(),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);

      const updatedValues = { ...values, id: userData?.apiData.id.toString() };
      const responseUser = await handleUpdateUser(updatedValues);

      if (responseUser.status === 200) {
        setAccountSettingSuccess(true);
        setIsSuccess(true);
        setShowError(false);
      } else {
        setIsSuccess(false);
        setShowError(true);
      }

      if (
        values.currentPassword !== '' &&
        values.newPassword !== '' &&
        values.confirmPassword !== ''
      ) {
        const responseChangePassword = await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        });
        if (responseChangePassword.status === 200) {
          setAccountSettingSuccess(true);
          setShowError(false);
          setIsSuccessChangePassword(true);
          formik.setFieldValue('currentPassword', '');
          formik.setFieldValue('newPassword', '');
          formik.setFieldValue('confirmPassword', '');
        } else {
          setIsSuccessChangePassword(false);
          setShowError(true);
        }
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: accountSettingFormValidation(),
  });

  return (
    <div className="w-full lg:mr-64">
      {(isChangePasswordError || isUpdateUserError) && (
        <Snackbar
          intent="error"
          show={
            isChangePasswordError || isUpdateUserError || showError === true
          }
          snackContent={(() => {
            if (isChangePasswordError) {
              return 'Current password is incorrect';
            } else if (isUpdateUserError) {
              return 'Could not update user';
            }
            return 'Something went wrong, please try again';
          })()}
        />
      )}
      <Snackbar
        intent="success"
        setSuccess={
          formik.values.currentPassword !== ''
            ? setIsSuccessChangePassword
            : setIsSuccess
        }
        show={
          formik.values.currentPassword !== ''
            ? isSuccess && isSuccessChangePassword
            : isSuccess
        }
        snackContent={'Successfully updated user'}
      />

      <Text
        className="tracking-wide"
        intent={'green'}
        size={'xs'}
        weight={'bold'}
      >
        ACCOUNT SETTINGS
      </Text>
      <form onSubmit={formik.handleSubmit}>
        <GeneralUserInfo
          date={date}
          formik={formik as unknown as FormikProps<UserPayload>}
          formikAttachment={formik as unknown as FormikProps<UserImageData>}
          profileImageKey={profileImageKey}
          selectedCountryForCode={selectedCountryForCode}
          setCountryCode={setCountryCode}
          setDate={setDate}
          setProfileImageKey={setProfileImageKey}
          setSelectedCountryForCode={setSelectedCountryForCode}
          setSelectedRole={() => {}}
          setShowError={setShowError}
        />
        <hr className="flex border-dashed border border-tints-battleship-grey-tint-5 my-4 mt-8" />
        {!showPasswordFields && (
          <Button
            className="!text-xs"
            intent={'ghost'}
            onClick={() => {
              setShowPasswordFields(true);
            }}
            preIcon={<KeySquare className="mr-2" size={16} variant="Bold" />}
            size={'ghost'}
          >
            CHANGE PASSWORD
          </Button>
        )}
        {showPasswordFields && (
          <>
            <Text intent={'green'} size={'xs'} weight={'bold'}>
              CHANGE PASSWORD
            </Text>
            <div className="flex flex-col mt-6 min-w-full">
              <div className="grid md:grid-cols-3 md:gap-x-5 md:gap-y-0 gap-y-2 w-full">
                <div className="flex flex-col gap-2">
                  <Text
                    className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red"
                    intent={'dark'}
                    size={'sm'}
                    weight={'normal'}
                  >
                    Current password
                  </Text>
                  <div className="relative">
                    <InputContainer
                      className="flex items-center"
                      error={
                        formik.errors.currentPassword
                          ? [formik.errors.currentPassword]
                          : undefined
                      }
                    >
                      <Input
                        className="mr-2 truncate"
                        name="currentPassword"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        placeholder={'Enter your old password'}
                        type={showPassword ? 'text' : 'password'}
                        value={formik.values.currentPassword}
                      />
                      <PasswordVisibilityButton
                        showPassword={showPassword}
                        togglePasswordVisibility={togglePasswordVisibility}
                      />
                    </InputContainer>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Text
                    className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red"
                    intent={'dark'}
                    size={'sm'}
                    weight={'normal'}
                  >
                    New password
                  </Text>
                  <div className="relative">
                    <InputContainer
                      className="flex items-center"
                      error={
                        formik.errors.newPassword
                          ? [formik.errors.newPassword]
                          : undefined
                      }
                    >
                      <Input
                        className="mr-2 truncate"
                        name="newPassword"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        placeholder={'Enter your new password'}
                        type={showNewPassword ? 'text' : 'password'}
                        value={formik.values.newPassword}
                      />
                      <PasswordVisibilityButton
                        showPassword={showNewPassword}
                        togglePasswordVisibility={toggleNewPasswordVisibility}
                      />
                    </InputContainer>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Text
                    className="font-albertSans after:content-['*'] after:ml-0.5 after:text-red"
                    intent={'dark'}
                    size={'sm'}
                    weight={'normal'}
                  >
                    Confirm password
                  </Text>
                  <div className="relative">
                    <InputContainer
                      className="flex items-center"
                      error={
                        formik.errors.confirmPassword
                          ? [formik.errors.confirmPassword]
                          : undefined
                      }
                    >
                      <Input
                        className="mr-2 truncate"
                        name="confirmPassword"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        placeholder={'Confirm your password'}
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formik.values.confirmPassword}
                      />
                      <PasswordVisibilityButton
                        showPassword={showConfirmPassword}
                        togglePasswordVisibility={
                          toggleConfirmPasswordVisibility
                        }
                      />
                    </InputContainer>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        <div className="flex flex-row w-full justify-end mt-10 mb-11">
          <div>
            <Button
              className="h-9.75 w-full justify-center"
              loading={isLoading}
              size={'md'}
              type="submit"
            >
              {' '}
              <span className="m-auto">Save changes</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountSettingForm;
