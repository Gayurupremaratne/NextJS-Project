export interface RoleResponse {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userCount: number;
}

export interface SingleRoleResponse {
  id: number;
  name: string;
  createdAt: string;
  RolePermission?: RolePermissionEntity[] | null;
}
export interface RolePermissionEntity {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: null;
  permission: Permission;
}
export interface Permission {
  id: number;
  action: string;
  permissionName: string;
  subject: string;
  inverted: boolean;
  conditions?: null;
  reason?: null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: null;
}

export interface PermissionResponse {
  id: number;
  action: string;
  permissionName: string;
  subject: string;
  inverted: boolean;
  createdAt: Date;
}

// has: subject has the action (data from db)
// active: enable/disable the checkbox (managed in the client)
export interface ModifiedPermission {
  subject: string;
  manage: {
    has: boolean;
    active: boolean;
    id: number;
  };
  read: {
    has: boolean;
    active: boolean;
    id: number;
  };
  create: {
    has: boolean;
    active: boolean;
    id: number;
  };
  update: {
    has: boolean;
    active: boolean;
    id: number;
  };
  delete: {
    has: boolean;
    active: boolean;
    id: number;
  };
}

export interface SelectedPermission {
  permissionId: number;
}

export interface AssignPermissionsCount {
  count: number;
}

export interface RoleRequest {
  name: string;
}
