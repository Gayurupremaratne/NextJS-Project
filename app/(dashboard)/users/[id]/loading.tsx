'use client';

import React from 'react';
import { Spinner } from '../../../../components/atomic';

export default function DashboardLoading() {
  return (
    <Spinner
      className="flex items-center justify-center mx-auto"
      loading={true}
      spinnerSize={'lg'}
    />
  );
}
