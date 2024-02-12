'use client';

import { useSnackbarStore } from '@/store/snackbar/snackbar';
import { useEffect, useState } from 'react';

type SnackbarIntent = 'success' | 'error' | 'warn' | 'info';
export interface SnackbarProps {
  show: boolean;
  intent?: SnackbarIntent;
  snackContent: string;
  setSuccess?: (value: boolean) => void;
  timeout?: number;
}

const getSnackbarBackgroundClass = (intent?: SnackbarIntent) => {
  switch (intent) {
    case 'success':
      return 'bg-snacks-success border border-solid border-snacks-borders-success';
    case 'error':
      return 'bg-snacks-error border border-solid border-snacks-borders-error';
    case 'warn':
      return 'bg-snacks-warn border border-solid border-snacks-borders-warn';
    default:
      return 'bg-snacks-info border border-solid border-snacks-borders-info';
  }
};

const getSnackbarTextClass = (intent?: SnackbarIntent) => {
  switch (intent) {
    case 'success':
      return 'text-snacks-borders-success';
    case 'error':
      return 'text-snacks-borders-error';
    case 'warn':
      return 'text-snacks-borders-warn';
    default:
      return 'text-snacks-borders-info';
  }
};

const getSnackbarCloseButtonClass = (intent?: SnackbarIntent) => {
  switch (intent) {
    case 'success':
      return 'bg-snacks-borders-success';
    case 'error':
      return 'bg-snacks-borders-error';
    case 'warn':
      return 'bg-snacks-borders-warn';
    default:
      return 'bg-snacks-borders-info';
  }
};

export const Snackbar = ({
  show,
  intent,
  snackContent,
  setSuccess,
  timeout,
}: SnackbarProps) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const { setMessage, setSnackbar } = useSnackbarStore();
  const handleClose = () => {
    setShowSnackbar(false);
    setMessage('');
    setSnackbar(false);
    if (typeof setSuccess !== 'undefined') {
      setSuccess(false);
    }
  };
  useEffect(() => {
    if (show) {
      setShowSnackbar(true);

      if (typeof timeout !== 'undefined') {
        const snackbarTimeout = setTimeout(() => {
          setShowSnackbar(false);
          setMessage('');
          setSnackbar(false);
        }, timeout);

        // Clear the timeout if the Snackbar is hidden manually
        return () => {
          clearTimeout(snackbarTimeout);
        };
      }

      if (typeof setSuccess !== 'undefined') {
        // Set a timeout to hide the Snackbar after 3 seconds (3000 milliseconds)
        const snackbarTimeout = setTimeout(() => {
          setShowSnackbar(false);
          if (typeof setSuccess !== 'undefined') {
            setSuccess(false);
          }
        }, 3000);

        // Clear the timeout if the Snackbar is hidden manually
        return () => {
          clearTimeout(snackbarTimeout);
        };
      }
    } else {
      setShowSnackbar(false);
    }
  }, [show, setSuccess]);

  return (
    <>
      {showSnackbar && (
        <div
          className={`flex items-center p-4 mb-2 ${getSnackbarBackgroundClass(
            intent,
          )} rounded-[5px]`}
          id="toast-default"
          role="alert"
        >
          <div
            className={`font-semibold text-md ${getSnackbarTextClass(intent)}`}
          >
            {snackContent}
          </div>
          <button
            aria-label="Close"
            className={`ml-auto -mx-1.5 -my-1.5 ${getSnackbarCloseButtonClass(
              intent,
            )} text-white hover:text-white rounded-full inline-flex items-center justify-center h-4 w-4`}
            data-dismiss-target="#toast-default"
            onClick={handleClose}
            type="button"
          >
            <span className="sr-only">Close</span>
            <svg
              aria-hidden="true"
              className="w-2 h-2"
              fill="none"
              viewBox="0 0 14 14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
      )}
    </>
  );
};
