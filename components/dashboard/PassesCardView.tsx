import { Subject, UserActions } from '@/constants/userPermissions';
import { InventoryAnalytics } from '@/types/inventory/inventory.type';
import { InventoryCard } from '../card';
import CustomCan from '../casl/CustomCan';

interface Props {
  analytics?: InventoryAnalytics;
}

const PassesCardView = ({ analytics }: Props) => {
  return (
    <CustomCan a={Subject.DashboardPasses} I={UserActions.Read}>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
          <InventoryCard
            title="Total inventory"
            value={analytics?.totalInventory.toString() ?? '0'}
          />
          <InventoryCard
            title="Passes allocated"
            value={analytics?.allocatedInventory.toString() ?? '0'}
          />
          <InventoryCard
            title="Passes remaining"
            value={analytics?.remainingInventory.toString() ?? '0'}
          />
          <InventoryCard
            title="Passes cancelled"
            value={analytics?.cancelledInventory.toString() ?? '0'}
          />
        </div>
      </div>
    </CustomCan>
  );
};

export default PassesCardView;
