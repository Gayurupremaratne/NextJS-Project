import React, { useEffect, useState } from 'react';
import { StageData, UserStage } from '@/types/stage/stage.type';
import { DataTable } from '@/components/atomic';
import { columns } from './StagesColumns';
import { useGetUserTrailTrackingStages } from '@/hooks/user/user';

interface StagesTabContentProps {
  userId: string;
  stagesStatus?: string | null;
}

const StagesTabContent: React.FC<StagesTabContentProps> = ({
  userId,
  stagesStatus,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [userStages, setUserStages] = useState<UserStage[]>([]);
  const { data: userTrailTrackingStages, refetch } =
    useGetUserTrailTrackingStages(
      userId,
      10,
      currentPage + 1,
      stagesStatus !== null ? stagesStatus : undefined,
    );

  useEffect(() => {
    refetch();
  }, [stagesStatus]);

  useEffect(() => {
    refetch();
  }, [currentPage]);

  useEffect(() => {
    if (userTrailTrackingStages) {
      const data = userTrailTrackingStages.data.data.data;

      const tempUserStages: UserStage[] = (data || []).map(
        (item: StageData) => {
          const stage = item.stage;
          const stageTranslation = stage.stagesTranslation[0];

          return {
            id: item.id,
            number: stage.number.toString(),
            trailHead: stageTranslation?.stageHead,
            trailEnd: stageTranslation?.stageTail,
            status: item.userTrailTracking?.isCompleted as boolean,
            completedPercentage: (
              item.userTrailTracking?.completion ?? 0
            ).toString(),
            bookedDate: new Date(item.createdAt),
            travelDate: new Date(item.reservedFor),
          };
        },
      );

      setUserStages(tempUserStages);
      setTotalPages(userTrailTrackingStages.data.data.meta?.lastPage);
    }
  }, [userTrailTrackingStages, stagesStatus]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="flex flex-col gap-6">
      <DataTable<UserStage>
        columns={columns}
        currentPage={currentPage}
        data={userStages}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default StagesTabContent;
