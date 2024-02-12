export const getAvatarInitials = (firstName?: string, lastName?: string) =>
  firstName && lastName
    ? firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase()
    : '';
