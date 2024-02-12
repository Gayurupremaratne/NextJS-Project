import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CreateRole,
  DeleteRole,
  GetRole,
  GetRoles,
  UpdateRole,
} from '@/api/roles/role';
import { ModifiedPermission, SelectedPermission } from '@/types/role/role.type';
import {
  AssignPermissions,
  GetPermissions,
  UpdateRolePermissions,
} from '@/api/permissions/permissions';
import { UseParams } from '@/constants/useParams';

const actions = ['manage', 'create', 'read', 'update', 'delete'] as const;

type Action = (typeof actions)[number];

const transformedPermissions: Record<
  string,
  Record<string, { has: boolean; active: boolean; id: number }>
> = {};

export const useGetAllRoles = (params: UseParams) => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const response = await GetRoles(params);
      return response;
    },
  });
};

export const useGetRole = (id: number) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: async () => {
      const response = await GetRole(id);
      return response;
    },
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { name: string }) => {
      const response = await CreateRole(data);
      if (response.status === 201) {
        return response.data.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['roles']);
      },
    },
  );
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { name: string; id: number }) => {
      const response = await UpdateRole(data.id, { name: data.name });
      if (response.status === 200) {
        return response.data.data;
      }
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['roles']);
        queryClient.invalidateQueries(['role', data?.id]);
      },
    },
  );
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: number) => {
      const response = await DeleteRole(id);
      if (response.status === 200) {
        return response.data.data;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['roles']);
      },
    },
  );
};

export const useGetAllPermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const allPermissions = await GetPermissions();

      // Transform the permissions data
      allPermissions.forEach(permission => {
        const { subject, action, id, inverted } = permission;

        if (inverted) {
          return;
        }

        if (!transformedPermissions[subject]) {
          transformedPermissions[subject] = {};
        }

        if (actions.includes(action as Action)) {
          transformedPermissions[subject][action] = {
            has: true,
            active: true,
            id,
          };
        } else {
          transformedPermissions[subject][action] = {
            has: false,
            active: false,
            id: -1,
          };
        }
      });

      // Convert the transformedPermissions
      const finalPermissionsArray: ModifiedPermission[] = Object.keys(
        transformedPermissions,
      ).map(subject => {
        const subjectActions = transformedPermissions[subject];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subjectObject: any = { subject };

        actions.forEach(action => {
          subjectObject[action] = subjectActions[action]?.has
            ? subjectActions[action]
            : { has: false, active: false, id: -1 };
        });

        return subjectObject;
      });

      return finalPermissionsArray;
    },
    staleTime: 0,
  });
};

export const useAssignPermissionsToRole = () => {
  return useMutation(
    async (data: { roleId: number; permissions: SelectedPermission[] }) => {
      await AssignPermissions(data.roleId, data.permissions);
    },
  );
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: { roleId: number; permissions: SelectedPermission[] }) => {
      await UpdateRolePermissions(data.roleId, data.permissions);
    },
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['roles']);
        queryClient.invalidateQueries(['role', variables.roleId]);
      },
    },
  );
};
