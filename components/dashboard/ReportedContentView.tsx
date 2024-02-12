import { Subject, UserActions } from '@/constants/userPermissions';
import { DashboardCard } from '../card';
import CustomCan from '../casl/CustomCan';
import ViewAllReportedAssetsDashboardWidget from '../reported-images/ReportedImages';
import { useRouter } from 'next/navigation';
import { Button, Text } from '../atomic';

const ReportedContentView = () => {
  const router = useRouter();
  return (
    <CustomCan a={Subject.DashboardReportedContent} I={UserActions.Read}>
      <DashboardCard className="h-auto col-span-2 p-0">
        <div className="flex flex-row justify-between py-2 px-4 items-center w-full border-b border-tints-forest-green-tint-6">
          <Text size={'md'} weight={'semiBold'}>
            Recent reported content
          </Text>
          <Button
            intent={'ghost'}
            onClick={() => router.push('/reported-images')}
          >
            View all
          </Button>
        </div>
        <ViewAllReportedAssetsDashboardWidget />
      </DashboardCard>
    </CustomCan>
  );
};

export default ReportedContentView;
