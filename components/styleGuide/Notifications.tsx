'use client';

import React from 'react';
import { Text } from '../atomic';
import { Snackbar } from '../atomic/Snackbar/Snackbar';

export const Notifications = () => {
  return (
    <div className="pt-[80px] md:px-14 px-4 gap-10 flex flex-col">
      <div className="flex flex-row items-center gap-3 pt-8">
        <hr className="w-[80px]" />
        <Text intent={'green'} size={'md'} weight={'bold'}>
          NOTIFICATIONS
        </Text>
      </div>
      <Text
        className="text-tints-battleship-grey-tint-3"
        size={'3xl'}
        weight={'normal'}
      >
        Notifications
      </Text>
      <div className="flex flex-col gap-10">
        <Snackbar
          intent="success"
          show={true}
          snackContent={'Whatever you did was successful!'}
        />
        <Snackbar
          intent="error"
          show={true}
          snackContent={'Oops! Something went wrong'}
        />
        <Snackbar
          intent="warn"
          show={true}
          snackContent={'Looks like something wants your attention'}
        />
        <Snackbar
          intent="info"
          show={true}
          snackContent={'You need to know this'}
        />
      </div>
    </div>
  );
};
