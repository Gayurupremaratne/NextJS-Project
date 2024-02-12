import { Button, Input, InputContainer, Text } from '@/components/atomic';
import { Form, Formik } from 'formik';
import 'react-phone-input-2/lib/style.css';
import 'react-phone-number-input/style.css';
import React, { useEffect, useState } from 'react';
import {
  useAssignPermissionsToRole,
  useCreateRole,
  useGetAllPermissions,
} from '@/hooks/role/role';
import { ModifiedPermission, SelectedPermission } from '@/types/role/role.type';
import {
  createRoleValidation,
  handleManageCheckboxChange,
  handleSuperAdminRoleChange,
} from './validations';
import { Snackbar } from '../atomic/Snackbar/Snackbar';
import { isAxiosError } from 'axios';
import { setErrorState } from '@/utils/utils';
import { ErrorState, initialErrorState } from '@/types/common.type';

export const checkboxChange = (
  permissionId: number | undefined,
  selectedPermissions: SelectedPermission[],
): SelectedPermission[] => {
  if (!permissionId) {
    return selectedPermissions;
  }

  const isSelected = selectedPermissions.some(
    selectedPermission => selectedPermission.permissionId === permissionId,
  );

  if (isSelected) {
    return selectedPermissions.filter(
      selectedPermission => selectedPermission.permissionId !== permissionId,
    );
  }
  return [...selectedPermissions, { permissionId: permissionId }];
};

interface Props {
  setShow: (show: boolean) => void;
}

const CreateRole = ({ setShow }: Props) => {
  const { data: allPermissions } = useGetAllPermissions();
  const {
    isLoading: isCreateRoleLoading,
    isError: isCreateRoleError,
    error: createRoleError,
    mutateAsync: createRole,
  } = useCreateRole();
  const {
    isLoading: isPermissionLoading,
    isError: isPermissionError,
    error: permissionError,
    mutateAsync: assignPermissions,
  } = useAssignPermissionsToRole();
  const [selectedPermissions, setSelectedPermissions] = useState<
    SelectedPermission[]
  >([]);

  const [error, setError] = useState<ErrorState>(initialErrorState);

  const handleCheckboxChange = (permissionId: number | undefined) =>
    setSelectedPermissions(prevState =>
      checkboxChange(permissionId, prevState),
    );

  useEffect(() => {
    setError(initialErrorState);
  }, [selectedPermissions]);

  const anyErrors = isCreateRoleError || isPermissionError || error.has;

  return (
    <div className="space-y-5">
      {anyErrors && (
        <Snackbar
          intent="error"
          show={anyErrors}
          snackContent={
            error.message
              ? error.message
              : isCreateRoleError && isAxiosError(createRoleError)
              ? createRoleError.response?.data?.message ||
                'Create role failed, please try again'
              : isPermissionError && isAxiosError(permissionError)
              ? permissionError.response?.data?.message ||
                'Create permission failed, please try again'
              : 'Something went wrong, please try again'
          }
        />
      )}
      <Formik
        initialValues={{
          name: '',
        }}
        onSubmit={async (values, { resetForm }) => {
          if (selectedPermissions.length <= 0) {
            setError({
              has: true,
              message: 'Please select at least one permission',
            });
            return;
          }

          try {
            // Step 1: Create the role
            const createdRole = await createRole({
              name: values.name,
            });

            // Step 2: Assign permissions to the role
            await assignPermissions({
              permissions: selectedPermissions,
              roleId: createdRole?.id as number,
            });

            if (!anyErrors) {
              setSelectedPermissions([]);
              resetForm();
              setShow(false);
            }
          } catch (e: unknown) {
            setError((prevState: ErrorState) => setErrorState(prevState, e));
          }
        }}
        validateOnBlur={false}
        validateOnChange={false}
        validationSchema={createRoleValidation}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form className="space-y-8" onSubmit={handleSubmit}>
            <div className="flex flex-row flex-wrap space-y-5 mt-5">
              <div className="flex flex-col space-y-2 w-full">
                <Text
                  className="tracking-wide"
                  intent={'green'}
                  size={'xs'}
                  weight={'bold'}
                >
                  ROLE
                </Text>
                <Text
                  className="text-tints-battleship-black-tint-2"
                  size={'md'}
                  weight={'normal'}
                >
                  Role name<span className="text-red">*</span>
                </Text>
                <InputContainer>
                  <Input
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter user role name"
                    type="text"
                    value={values.name}
                  />
                </InputContainer>
                <Text intent={'red'} size={'sm'}>
                  {errors.name && touched.name && errors.name}
                </Text>
              </div>
            </div>
            <div>
              <div>
                <Text
                  className="tracking-wide"
                  intent={'green'}
                  size={'xs'}
                  weight={'bold'}
                >
                  ROLE PERMISSIONS
                </Text>
              </div>

              {allPermissions && (
                <div className="flex flex-col">
                  {/* Table Header */}
                  <div className="flex items-center py-2 space-x-4 text-center">
                    <div className="w-6/12"></div>
                    <div className="w-1/12">
                      <Text className={'text-sm lg:text-md'} weight={'medium'}>
                        Manage
                      </Text>
                    </div>
                    <div className="w-1/12">
                      <Text className={'text-sm lg:text-md'} weight={'medium'}>
                        Read
                      </Text>
                    </div>
                    <div className="w-1/12">
                      <Text className={'text-sm lg:text-md'} weight={'medium'}>
                        Create
                      </Text>
                    </div>
                    <div className="w-1/12">
                      <Text className={'text-sm lg:text-md'} weight={'medium'}>
                        Update
                      </Text>
                    </div>
                    <div className="w-1/12">
                      <Text className={'text-sm lg:text-md'} weight={'medium'}>
                        Delete
                      </Text>
                    </div>
                  </div>

                  {/* Permission Rows */}
                  {allPermissions.map((permission: ModifiedPermission) => (
                    <div
                      className="flex items-center py-2 space-x-4 lg:text-md text-sm"
                      key={permission.subject}
                    >
                      <div className="w-6/12">{permission.subject}</div>
                      {/* manage */}
                      <div className="w-1/12 flex items-center justify-center">
                        <input
                          checked={selectedPermissions.some(
                            selectedPermission =>
                              selectedPermission.permissionId ===
                              permission.manage.id,
                          )}
                          className="mr-2"
                          disabled={
                            !permission.manage?.has ||
                            !permission.manage?.active
                          }
                          onChange={() => {
                            // get the latest selected permissions
                            // to avoid stale closure
                            const updatedPermissions = checkboxChange(
                              permission.manage.id,
                              selectedPermissions,
                            );
                            setSelectedPermissions(updatedPermissions);

                            // disable checkboxes, super admin role
                            handleSuperAdminRoleChange(
                              permission.manage.id,
                              updatedPermissions,
                              setSelectedPermissions,
                              allPermissions,
                            );

                            // disable checkboxes, manage role
                            handleManageCheckboxChange(
                              permission,
                              updatedPermissions,
                              setSelectedPermissions,
                            );
                          }}
                          type="checkbox"
                        />
                      </div>
                      {/* read */}
                      <div className="w-1/12 flex items-center justify-center">
                        <input
                          checked={selectedPermissions.some(
                            selectedPermission =>
                              selectedPermission.permissionId ===
                              permission.read.id,
                          )}
                          className="mr-2"
                          disabled={
                            !permission.read?.has || !permission.read?.active
                          }
                          onChange={() =>
                            handleCheckboxChange(permission.read.id)
                          }
                          type="checkbox"
                        />
                      </div>
                      {/* create */}
                      <div className="w-1/12 flex items-center justify-center">
                        <input
                          checked={selectedPermissions.some(
                            selectedPermission =>
                              selectedPermission.permissionId ===
                              permission.create.id,
                          )}
                          className="mr-2"
                          disabled={
                            !permission.create?.has ||
                            !permission.create?.active
                          }
                          onChange={() =>
                            handleCheckboxChange(permission.create.id)
                          }
                          type="checkbox"
                        />
                      </div>
                      {/* update */}
                      <div className="w-1/12 flex items-center justify-center">
                        <input
                          checked={selectedPermissions.some(
                            selectedPermission =>
                              selectedPermission.permissionId ===
                              permission.update.id,
                          )}
                          className="mr-2"
                          disabled={
                            !permission.update?.has ||
                            !permission.update?.active
                          }
                          onChange={() =>
                            handleCheckboxChange(permission.update.id)
                          }
                          type="checkbox"
                        />
                      </div>
                      {/* delete */}
                      <div className="w-1/12 flex items-center justify-center">
                        <input
                          checked={selectedPermissions.some(
                            selectedPermission =>
                              selectedPermission.permissionId ===
                              permission.delete.id,
                          )}
                          className="mr-2"
                          disabled={
                            !permission.delete?.has ||
                            !permission.delete?.active
                          }
                          onChange={() =>
                            handleCheckboxChange(permission.delete.id)
                          }
                          type="checkbox"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-row w-full justify-end pb-10">
              <div>
                <Button
                  className="justify-center"
                  loading={isCreateRoleLoading || isPermissionLoading}
                  size={'md'}
                  type="submit"
                >
                  Create role
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateRole;
