import { Label } from '@/components/atomic';
import { Grammerly } from 'iconsax-react';
import React from 'react';

const isInactive = (loginAt: Date) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return new Date(loginAt) <= thirtyDaysAgo;
};

// Function to render the status of the user
const UserStatusCellComponent = (loginAt: Date) => {
  const isActive = !isInactive(loginAt);
  return (
    <span>
      {isActive ? (
        <Label
          intent={'active'}
          postIcon={<Grammerly size={16} variant="Bold" />}
        >
          Active
        </Label>
      ) : (
        <Label
          intent={'inactive'}
          postIcon={<Grammerly size={16} variant="Bold" />}
        >
          Inactive
        </Label>
      )}
    </span>
  );
};

export default UserStatusCellComponent;
