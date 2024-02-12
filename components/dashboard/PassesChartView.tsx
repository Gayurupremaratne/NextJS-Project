import { Subject, UserActions } from '@/constants/userPermissions';
import { InventoryResponse } from '@/types/inventory/inventory.type';
import { DashboardCard } from '../card';
import CustomCan from '../casl/CustomCan';
import PassesChart from '../passes-chart/PassesChart';

interface Props {
  data?: InventoryResponse;
  currentMonth: Date;
}

const PassesChartView = ({ data, currentMonth }: Props) => {
  return (
    <CustomCan a={Subject.DashboardPassesChart} I={UserActions.Read}>
      <DashboardCard className="h-[349px] col-span-3 w-full">
        <PassesChart
          data={data}
          month={(currentMonth.getMonth() + 1).toString().padStart(2, '0')}
          year={currentMonth.getFullYear().toString()}
        />
      </DashboardCard>
    </CustomCan>
  );
};

export default PassesChartView;
