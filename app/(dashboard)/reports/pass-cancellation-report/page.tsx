'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Button,
  DataTable,
  Heading,
  SingleSelect,
  Text,
} from '@/components/atomic';
import { DateRange } from '@/components/atomic/DateRange';
import { DateValueType } from '@/components/atomic/DateRange/types';
import { CancelledPassRecord } from '@/types/report/report.type';
import { Translation } from '@/types/stage/stage.type';
import React, { useEffect, useState } from 'react';
import { columns } from './PassCancellationReportColumns';
import {
  useGetCancelledPassesReport,
  useGetDownloadableCancelledPassesReport,
} from '@/hooks/reports/report';
import { DocumentDownload } from 'iconsax-react';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import useGetStagesForReports from '../useGetStagesToReports';

const CancelledPassReport = () => {
  const {
    stages,
    selectedStageId,
    oneStage,
    refetchOneStage,
    setSelectedStageId,
  } = useGetStagesForReports();

  const [date, setDate] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [users, setUsers] = useState<CancelledPassRecord[]>([]);

  const { data: passCancellationReportData, refetch: passCancellationRefetch } =
    useGetCancelledPassesReport(selectedStageId, date?.startDate as string);

  useEffect(() => {
    if (selectedStageId) {
      passCancellationRefetch();
    }
    refetchOneStage();
  }, [date?.startDate, selectedStageId]);

  useEffect(() => {
    if (passCancellationReportData && passCancellationReportData?.length > 0) {
      const reportDataCopy = passCancellationReportData;
      let total = 0;

      passCancellationReportData.forEach((item: CancelledPassRecord) => {
        total += item.passesCount;
      });

      const lastRow: CancelledPassRecord = {
        user: {
          firstName: 'Total cancelled passes',
          lastName: '',
          nationalityCode: '',
        },
        passesCount: total,
      };
      reportDataCopy.push(lastRow);
      setUsers(reportDataCopy);
      return;
    }
    setUsers([]);
  }, [passCancellationReportData]);

  const getHeadToTail = () => {
    const englishTranslation: Translation = oneStage?.translations?.find(
      (t: Translation) => t.localeId === 'en',
    ) as Translation;
    return (
      <Text weight="normal">{`${englishTranslation?.stageHead} / ${englishTranslation?.stageTail}`}</Text>
    );
  };

  const getStageNumber = (number: number) => {
    const n = number < 10 ? `${0}${number}` : number;
    return `STAGE ${n}`;
  };

  const { refetch: getDownloadableReport } =
    useGetDownloadableCancelledPassesReport(
      selectedStageId,
      date?.startDate as string,
    );

  const downloadFile = async () => getDownloadableReport();

  const getInitialStage = () => {
    return stages[stages.findIndex(s => s.id === selectedStageId)];
  };

  return (
    <ProtectedRoute>
      <CustomCan
        a={Subject.CancelPassesReports}
        I={UserActions.Read}
        isForbidden={true}
      >
        <div className="flex flex-col gap-3 w-full">
          <div className="w-full self-center mb-8">
            <div className="flex xl:flex-row flex-col gap-x-6 lg:justify-between w-full">
              <div className="flex flex-col gap-1">
                <Heading className="mb-2" intent="h3">
                  Stage wise pass cancellation summary report
                </Heading>
                {oneStage && (
                  <div className="flex">
                    <Text
                      intent={'forestGreenTintTwo'}
                      size={'xs'}
                      weight="bold"
                    >
                      {getStageNumber(oneStage?.number)}
                    </Text>
                    &nbsp;{getHeadToTail()}
                  </div>
                )}
              </div>
              <div className="flex w-auto md:flex-row flex-col items-center gap-x-4 xl:gap-y-0 gap-y-2">
                <div className="flex md:flex-row flex-col gap-x-3 md:w-auto w-full self-start gap-y-3">
                  <DateRange
                    asSingle={true}
                    onChange={value => {
                      setDate(value);
                    }}
                    showFooter={false}
                    showShortcuts={false}
                    useRange={false}
                    value={date}
                  />
                  <SingleSelect
                    initialSelected={getInitialStage()}
                    items={stages}
                    tabIndex={e => {
                      setSelectedStageId(e as string);
                    }}
                  />
                </div>
                <div className="flex self-start xl:w-40 md:w-40 w-full">
                  <Button
                    className={'xl:w-40 w-full !px-1'}
                    disabled={users.length === 0}
                    intent="primary"
                    onClick={downloadFile}
                    preIcon={<DocumentDownload className="m-2" size="20" />}
                    size={'md'}
                  >
                    Export to xlsx
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DataTable<CancelledPassRecord>
            columns={columns}
            currentPage={0}
            data={users}
            onPageChange={() => {}}
            totalPages={0}
          />
        </div>
      </CustomCan>
    </ProtectedRoute>
  );
};

export default CancelledPassReport;
