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
import { StageWiseSummaryReportDto } from '@/types/report/report.type';
import { Translation } from '@/types/stage/stage.type';
import React, { useEffect, useState } from 'react';
import { columns } from './StageWiseSummaryTableColumns';
import {
  useGetDownloadableStageWiseSummaryReport,
  useGetStageWiseSummaryReport,
} from '@/hooks/reports/report';
import { DocumentDownload } from 'iconsax-react';
import CustomCan from '@/components/casl/CustomCan';
import { Subject, UserActions } from '@/constants/userPermissions';
import useGetStagesForReports from '../useGetStagesToReports';

const StageWiseSummaryReport = () => {
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
  const [users, setUsers] = useState<StageWiseSummaryReportDto[]>([]);

  const { data: reportData, refetch } = useGetStageWiseSummaryReport(
    selectedStageId,
    date?.startDate as string,
  );

  useEffect(() => {
    if (selectedStageId) {
      refetch();
    }
    refetchOneStage();
  }, [date?.startDate, selectedStageId]);

  useEffect(() => {
    if (reportData && reportData?.length > 0) {
      const reportDataCopy = reportData;
      let total = 0;

      reportData.forEach((item: StageWiseSummaryReportDto) => {
        total += item.passCount;
      });

      const lastRow: StageWiseSummaryReportDto = {
        user: {
          firstName: 'Total reserved passes',
          lastName: '',
          nationalityCode: '',
        },
        passCount: total,
      };
      reportDataCopy.push(lastRow);
      setUsers(reportDataCopy);
      return;
    }
    setUsers([]);
  }, [reportData]);

  const getHeadToTail = () => {
    const englishTranslation: Translation = oneStage?.translations?.find(
      (t: Translation) => t.localeId === 'en',
    ) as Translation;
    return (
      <Text weight="medium">{`${englishTranslation?.stageHead} / ${englishTranslation?.stageTail}`}</Text>
    );
  };

  const getStageNumber = (number: number) => {
    const n = number < 10 ? `${0}${number}` : number;
    return `STAGE ${n}`;
  };

  const { refetch: getDownloadableReport } =
    useGetDownloadableStageWiseSummaryReport(
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
        a={Subject.StageWiseSummary}
        I={UserActions.Read}
        isForbidden={true}
      >
        <div className="flex flex-col gap-3 w-full">
          <div className="w-full self-center mb-8">
            <div className="flex gap-x-6 md:justify-between w-full xl:flex-row flex-col">
              <div className="flex flex-col gap-1">
                <Heading className="mb-2" intent="h3">
                  Stage wise summary report
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
              <div className="flex md:flex-row flex-col items-center gap-x-6 xl:gap-y-0 gap-y-2">
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
                <div>
                  <Button
                    className="w-48"
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
          <DataTable<StageWiseSummaryReportDto>
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

export default StageWiseSummaryReport;
