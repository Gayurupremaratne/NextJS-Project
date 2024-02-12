import { Item } from '@/components/atomic';
import { useGetLiteStages, useGetStage } from '@/hooks/stage/stage';
import { LiteStageType } from '@/types/stage/stage.type';
import { useEffect, useState } from 'react';

const useGetStagesForReports = () => {
  const [stages, setStages] = useState<Item[]>([]);
  const [selectedStageId, setSelectedStageId] = useState('');

  const { data: oneStage, refetch: refetchOneStage } =
    useGetStage(selectedStageId);
  const { data } = useGetLiteStages();

  useEffect(() => {
    if (data) {
      const stageItems: Item[] = [];
      data.map((item: LiteStageType) => {
        stageItems.push({
          id: item.id,
          name: `Stage ${item.number}`,
        });
      });
      setSelectedStageId(stageItems[0]?.id as string);
      setStages(stageItems);
    }
  }, [data]);

  return {
    stages,
    selectedStageId,
    oneStage,
    refetchOneStage,
    setSelectedStageId,
  };
};

export default useGetStagesForReports;
