import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // set stale time as 30 seconds
          staleTime: 1000 * 30,
        },
      },
    }),
);
export default getQueryClient;
