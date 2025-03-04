import React, { createContext, useContext, useState } from 'react';
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../config/roles';

const RoleContext = createContext(null);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [teamRole, setTeamRole] = useState(null);

  const hasPermission = (permission) => {
    if (!userRole) return false;
    return ROLE_PERMISSIONS[userRole]?.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  const isOwner = () => userRole === ROLES.OWNER;
  const isAdmin = () => userRole === ROLES.ADMIN;
  const isUser = () => userRole === ROLES.USER;

  const value = {
    userRole,
    setUserRole,
    teamRole,
    setTeamRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isOwner,
    isAdmin,
    isUser,
    ROLES,
    PERMISSIONS
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}; 