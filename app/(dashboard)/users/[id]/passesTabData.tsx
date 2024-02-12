import React, { useEffect, useState } from 'react';
import { PassOrder, UserPass } from '@/types/inventory/inventory.type';
import { DataTable } from '@/components/atomic';
import { columns } from './passesColumns';
import { useGetPassesByUserId } from '@/hooks/passes/passes';

interface PassesTabContentProps {
  userId: string;
  passesStatus?: string | null;
}

const PassesTabContent: React.FC<PassesTabContentProps> = ({
  userId,
  passesStatus,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [userPassesData, setUserPassesData] = useState<UserPass[]>([]);

  const { data: userPasses, refetch } = useGetPassesByUserId(
    userId,
    10,
    currentPage + 1,
    passesStatus !== null ? passesStatus : undefined,
  );

  useEffect(() => {
    refetch();
  }, [passesStatus]);

  useEffect(() => {
    refetch();
  }, [currentPage]);

  useEffect(() => {
    if (userPasses) {
      const data = userPasses.data.data.data;
      const tempUserPasses: UserPass[] = (data || []).map((item: PassOrder) => {
        const stage = item.stageData;
        const stageTranslation = stage.stagesTranslation[0];

        return {
          id: item.orderId,
          number: stage.number,
          trailHead: stageTranslation?.stageHead,
          trailEnd: stageTranslation?.stageTail,
          status: item.status,
          count: item.passCount,
          travelDate: new Date(item.reservedFor),
        };
      });
      setUserPassesData(tempUserPasses);
      setTotalPages(userPasses.data.data.meta?.lastPage);
    }
  }, [userPasses, passesStatus]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="flex flex-col gap-6">
      <DataTable<UserPass>
        columns={columns}
        currentPage={currentPage}
        data={userPassesData}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default PassesTabContent;
