import { FC } from 'react';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { InventoryResponse } from '@/types/inventory/inventory.type';
import { Heading, Text } from '../atomic';
import { Activity } from 'iconsax-react';
import { theme } from '@/tailwind.config';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface PassesChartProps {
  data: InventoryResponse | undefined;
  month: string; // Month from props
  year: string; // Year from props
}

const PassesChart: FC<PassesChartProps> = ({ data, month, year }) => {
  // Extract all days of the month as labels
  const daysInMonth = Array.from(
    { length: new Date(parseInt(year), parseInt(month), 0).getDate() },
    (_, i) =>
      new Date(parseInt(year), parseInt(month) - 1, i + 1).toLocaleDateString(
        'en-US',
      ),
  );

  const labels = daysInMonth.map(label =>
    new Date(label).toLocaleDateString('en-US', { day: 'numeric' }),
  );

  // Prepare datasets
  const inventoryData = daysInMonth.map(label => {
    const matchingEntry = data?.data.find(
      entry => new Date(entry.date).toLocaleDateString() === label,
    );
    return matchingEntry ? matchingEntry.inventoryQuantity : 0;
  });

  const reservedData = daysInMonth.map(label => {
    const matchingEntry = data?.data.find(
      entry => new Date(entry.date).toLocaleDateString() === label,
    );
    return matchingEntry ? matchingEntry.reservedQuantity : 0;
  });

  const remainingData = daysInMonth.map((label, index) => {
    return inventoryData[index] - reservedData[index];
  });

  const cancelledData = daysInMonth.map(label => {
    const matchingEntry = data?.data.find(
      entry => new Date(entry.date).toLocaleDateString() === label,
    );
    return matchingEntry ? matchingEntry.cancelledQuantity : 0;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Allocated Quantity',
        data: reservedData,
        borderColor: 'rgb(121, 212, 241)',
        backgroundColor: 'rgb(121, 212, 241, 0.5)',
      },
      {
        label: 'Remaining Quantity',
        data: remainingData,
        borderColor: 'rgb(176, 225, 149)',
        backgroundColor: 'rgb(176, 225, 149, 0.5)',
      },
      {
        label: 'Cancelled Quantity',
        data: cancelledData,
        borderColor: 'rgb(247, 164, 123)',
        backgroundColor: 'rgb(247, 164, 123, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E5E5',
        },
      },
      x: {
        grid: {
          color: '#E5E5E5',
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center h-full w-full p-5">
      <div className="grid grid-cols-12 w-full">
        <div className="col-span-12 md:col-span-3 mb-3 md:mb-0">
          <Heading intent={'h4'}>Passes overview</Heading>
        </div>

        <div className="col-span-12 md:col-span-3 flex flex-row w-full">
          <div className="flex flex-row md:flex-col justify-between w-full  md:items-end">
            <div className="flex flex-row gap-2 items-center">
              <Activity color={theme.colors.data['color-3']} size="16" />
              <Text size="sm" weight="medium">
                Passes allocated
              </Text>
            </div>
            <Text className="text-end" size="md" weight="bold">
              {data?.analytics?.allocatedInventory.toString() || '0'}
            </Text>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 flex flex-row w-full">
          <div className="flex flex-row md:flex-col justify-between w-full  md:items-end">
            <div className="flex flex-row gap-2 items-center">
              <Activity color={theme.colors.data['color-9']} size="16" />
              <Text size="sm" weight="medium">
                Passes booked
              </Text>
            </div>
            <Text className="text-end" size="md" weight="bold">
              {data?.analytics?.remainingInventory.toString() || '0'}
            </Text>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3 flex flex-row w-full">
          <div className="flex flex-row md:flex-col justify-between w-full  md:items-end">
            <div className="flex flex-row gap-2 items-center">
              <Activity color={theme.colors.data['color-2']} size="16" />
              <Text size="sm" weight="medium">
                Passes cancelled
              </Text>
            </div>
            <Text className="text-end" size="md" weight="bold">
              {data?.analytics?.cancelledInventory.toString() || '0'}
            </Text>
          </div>
        </div>
      </div>
      <div className="mt-3 h-full w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default PassesChart;
