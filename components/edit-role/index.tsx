import {
  Button,
  Heading,
  Input,
  InputContainer,
  Text,
} from '@/components/atomic';
import { Form, Formik } from 'formik';
import 'react-phone-input-2/lib/style.css';
import 'react-phone-number-input/style.css';
import React, { useEffect, useState } from 'react';
import {
  useDeleteRole,
  useGetAllPermissions,
  useGetRole,
  useUpdateRole,
  useUpdateRolePermissions,
} from '@/hooks/role/role';
import { ModifiedPermission, SelectedPermission } from '@/types/role/role.type';
import { areArraysOfObjectsEqual, createRoleValidation } from './validations';
import { checkboxChange } from '../create-role';
import { Snackbar } from '../atomic/Snackbar/Snackbar';
import { isAxiosError } from 'axios';
import {
  handleManageCheckboxChange,
  handleSuperAdminRoleChange,
  SUPER_ADMIN_ROLE_ID,
} from '../create-role/validations';
import { AlertDialog } from '../atomic/Modal';
import { useRouter } from 'next/navigation';
import { setErrorState } from '@/utils/utils';
import { ErrorState, initialErrorState } from '@/types/common.type';

interface Props {
  id: number;
  setShow: (show: boolean) => void;
}

const EditRole = ({ id, setShow }: Props) => {
  const { data: allPermissions } = useGetAllPermissions();
  const { data: roleData } = useGetRole(id);
  const {
    isLoading: isRoleUpdateLoading,
    isError: isRoleUpdateError,
    error: roleUpdateError,
    mutateAsync: updateRole,
  } = useUpdateRole();
  const {
    isLoading: isPermissionLoading,
    isError: isPermissionError,
    error: permissionError,
    mutateAsync: assignPermissions,
  } = useUpdateRolePermissions();
  const {
    error: deleteRoleError,
    isLoading: isDeleteRoleLoading,
    isError: isDeleteRoleError,
    mutateAsync: deleteRole,
  } = useDeleteRole();

  const [selectedPermissions, setSelectedPermissions] = useState<
    SelectedPermission[]
  >([]);
  const [originalPermissions, setOriginalPermissions] = useState<
    SelectedPermission[]
  >([]);

  const [error, setError] = useState<ErrorState>(initialErrorState);

  const [showModal, setshowModal] = useState(false);

  const router = useRouter();

  const handleCheckboxChange = (permissionId: number | undefined) =>
    setSelectedPermissions(prevState =>
      checkboxChange(permissionId, prevState),
    );

  // add the role's permissions to the selectedPermissions state
  useEffect(() => {
    if (roleData) {
      const rolePermissions: SelectedPermission[] = [];

      if (roleData.RolePermission) {
        roleData.RolePermission.forEach(rolePermission => {
          if (rolePermission.permission) {
            rolePermissions.push({
              permissionId: rolePermission.permission.id,
            });
          }
        });

        // disable checkboxes based on initial data
        allPermissions?.forEach(permission => {
          if (
            rolePermissions.some(
              rolePermission =>
                rolePermission.permissionId === SUPER_ADMIN_ROLE_ID,
            )
          ) {
            handleSuperAdminRoleChange(
              permission.manage.id,
              rolePermissions,
              setSelectedPermissions,
              allPermissions,
            );
            return;
          }
          handleManageCheckboxChange(
            permission,
            rolePermissions,
            setSelectedPermissions,
          );
        });

        setSelectedPermissions(rolePermissions);
        // keep the original permissions in state
        // to compare against when submitting the form
        setOriginalPermissions(rolePermissions);
      }
    }
  }, [allPermissions, roleData]);

  useEffect(() => {
    setError(initialErrorState);
  }, [selectedPermissions]);

  const anyErrors =
    isRoleUpdateError || isPermissionError || isDeleteRoleError || error.has;

  const handleDelete = async () => {
    await deleteRole(id);
    if (!anyErrors) {
      setShow(false);
      router.push('/roles');
    }
  };

  return (
    <div className="space-y-5">
      {anyErrors && (
        <Snackbar
          intent="error"
          show={anyErrors}
          snackContent={
            error.message
              ? error.message
              : isRoleUpdateError && isAxiosError(roleUpdateError)
              ? roleUpdateError.response?.data?.message ||
                'Update role failed, please try again'
              : isPermissionError && isAxiosError(permissionError)
              ? permissionError.response?.data?.message ||
                'Update permissions failed, please try again'
              : isDeleteRoleError && isAxiosError(deleteRoleError)
              ? deleteRoleError.response?.data?.message ||
                'Delete role failed, please try again'
              : 'Something went wrong, please try again'
          }
        />
      )}
      {roleData && (
        <Formik
          initialValues={{
            name: roleData?.name || '',
          }}
          onSubmit={async values => {
            if (selectedPermissions.length <= 0) {
              setError({
                has: true,
                message: 'Please select at least one permission',
              });
              return;
            }
            try {
              // Update the role
              if (values.name !== roleData.name) {
                await updateRole({
                  id: id,
                  name: values.name,
                });
              }

              // Assign permissions to the role
              if (
                !areArraysOfObjectsEqual(
                  selectedPermissions,
                  originalPermissions,
                )
              ) {
                await assignPermissions({
                  permissions: selectedPermissions,
                  roleId: id,
                });
              }

              if (!anyErrors) {
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
                  <Text intent={'green'} size={'xs'} weight={'bold'}>
                    ROLE
                  </Text>
                  <Text
                    className="text-tints-battleship-black-tint-2"
                    size={'sm'}
                    weight={'normal'}
                  >
                    Role name
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
                  <Text intent={'green'} size={'xs'} weight={'bold'}>
                    ROLE PERMISSIONS
                  </Text>
                </div>

                {allPermissions && (
                  <div className="flex flex-col">
                    {/* Table Header */}
                    <div className="flex items-center py-2 space-x-4 text-center">
                      <div className="w-6/12"></div>
                      <div className="w-1/12">Manage</div>
                      <div className="w-1/12">Read</div>
                      <div className="w-1/12">Create</div>
                      <div className="w-1/12">Update</div>
                      <div className="w-1/12">Delete</div>
                    </div>

                    {/* Permission Rows */}
                    {allPermissions.map((permission: ModifiedPermission) => (
                      <div
                        className="flex items-center py-2 space-x-4"
                        key={permission.subject}
                      >
                        <div className="w-6/12">{permission.subject}</div>
                        {/* manage */}
                        <div className="w-1/12 flex items-center justify-center">
                          <input
                            checked={selectedPermissions.some(
                              selectedPermission =>
                                selectedPermission.permissionId ===
                                permission.manage?.id,
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
                                permission.read?.id,
                            )}
                            className="mr-2"
                            disabled={
                              !permission.read?.has || !permission.read?.active
                            }
                            onChange={() =>
                              handleCheckboxChange(permission.read?.id)
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
                                permission.create?.id,
                            )}
                            className="mr-2"
                            disabled={
                              !permission.create?.has ||
                              !permission.create?.active
                            }
                            onChange={() =>
                              handleCheckboxChange(permission.create?.id)
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
                                permission.update?.id,
                            )}
                            className="mr-2"
                            disabled={
                              !permission.update?.has ||
                              !permission.update?.active
                            }
                            onChange={() =>
                              handleCheckboxChange(permission.update?.id)
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
                                permission.delete?.id,
                            )}
                            className="mr-2"
                            disabled={
                              !permission.delete?.has ||
                              !permission.delete?.active
                            }
                            onChange={() =>
                              handleCheckboxChange(permission.delete?.id)
                            }
                            type="checkbox"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-row w-full justify-end space-x-4">
                <div>
                  <Button
                    className="h-9 justify-center"
                    intent={'danger'}
                    loading={isDeleteRoleLoading}
                    onClick={() => setshowModal(true)}
                    size={'md'}
                    type="button"
                  >
                    <span className="m-auto">Delete user role</span>
                  </Button>
                </div>
                <div>
                  <Button
                    className="h-9 justify-center"
                    loading={isRoleUpdateLoading || isPermissionLoading}
                    size={'md'}
                    type="submit"
                  >
                    <span className="m-auto">Save changes</span>
                  </Button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
      {showModal && (
        <AlertDialog
          buttonFunction={() => handleDelete()}
          buttontText="Delete"
          modalTitle="Delete role"
          setShow={value => setshowModal(value)}
          show={showModal}
        >
          <Heading
            intent={'h6'}
          >{`Are you sure you want to delete "${roleData?.name}"?`}</Heading>
          <Text
            className="text-tints-battleship-grey-tint-3 mt-2"
            size={'sm'}
            weight={'normal'}
          >
            You cannot undo this action. All text and information associated
            with this role will be permanently deleted.
          </Text>
        </AlertDialog>
      )}
    </div>
  );
};

export default EditRole;
