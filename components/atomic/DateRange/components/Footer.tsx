import dayjs from 'dayjs';
import React, { useCallback, useContext } from 'react';

import { DATE_FORMAT } from '../constants';
import DatepickerContext from '../contexts/DatepickerContext';

import { Button } from '@/components/atomic';

const Footer: React.FC = () => {
  // Contexts
  const { hideDatepicker, period, changeDatepickerValue, configs, classNames } =
    useContext(DatepickerContext);

  // Functions
  const getClassName = useCallback(() => {
    if (
      typeof classNames !== 'undefined' &&
      typeof classNames?.footer === 'function'
    ) {
      return classNames.footer();
    }

    return 'flex items-center justify-end pb-2.5 pr-8 pt-3 border-t border-tints-battleship-grey-tint-5';
  }, [classNames]);

  return (
    <div className={getClassName()}>
      <div className="w-full md:w-auto flex items-center justify-center space-x-3">
        <Button
          intent={'secondary'}
          onClick={() => {
            hideDatepicker();
          }}
          size={'md'}
        >
          <>{configs?.footer?.cancel ? configs.footer.cancel : 'Cancel'}</>
        </Button>
        <Button
          disabled={!(period.start && period.end)}
          intent={'primary'}
          onClick={() => {
            if (period.start && period.end) {
              changeDatepickerValue({
                startDate: dayjs(period.start).format(DATE_FORMAT),
                endDate: dayjs(period.end).format(DATE_FORMAT),
              });
              hideDatepicker();
            }
          }}
          size={'md'}
        >
          <>{configs?.footer?.apply ? configs.footer.apply : 'Set date'}</>
        </Button>
      </div>
    </div>
  );
};

export default Footer;
