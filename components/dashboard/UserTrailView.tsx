import { Subject, UserActions } from '@/constants/userPermissions';
import { DashboardCard } from '../card';
import CustomCan from '../casl/CustomCan';
import UserTrailChart from '../user-trail-chart/UserTrailChart';
import { useGetAllUsersTrailCompletionSummary } from '@/hooks/trailTracking/trailTracking';

interface Props {
  currentMonth: Date;
  stageId: string;
}

const UserTrailView = ({ currentMonth, stageId }: Props) => {
  const { data } = useGetAllUsersTrailCompletionSummary({
    stageId,
    month: (currentMonth.getMonth() + 1).toString().padStart(2, '0'),
    year: currentMonth.getFullYear().toString(),
  });

  return (
    <CustomCan a={Subject.DashboardUserTrailSummary} I={UserActions.Read}>
      <DashboardCard className="h-[349px] col-span-1">
        <UserTrailChart data={data} />
      </DashboardCard>
    </CustomCan>
  );
};

export default UserTrailView;
