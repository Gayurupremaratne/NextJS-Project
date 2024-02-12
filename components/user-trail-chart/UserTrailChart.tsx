import { FC } from 'react';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { GetAllUsersTrailSummaryResponse } from '@/types/trail-tracking/trail-tracking';
import { Text } from '../atomic';

ChartJS.register(ArcElement, Tooltip, Legend);

interface UserTrailChartProps {
  data: GetAllUsersTrailSummaryResponse | undefined;
}

const UserTrailChart: FC<UserTrailChartProps> = ({ data }) => {
  const chartData = {
    labels: ['Completed', 'Partially completed', 'Not attempted'],
    datasets: [
      {
        data: [
          data?.totalCompletedUsers,
          data?.totalPartiallyCompleteUsers,
          data?.totalNotAttemptedUsers,
        ],
        backgroundColor: [
          'rgb(121, 212, 241)',
          'rgb(176, 225, 149)',
          'rgb(247, 164, 123)',
        ],
        borderColor: [
          'rgb(121, 212, 241)',
          'rgb(176, 225, 149)',
          'rgb(247, 164, 123)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div className="flex flex-col h-full w-full p-5">
      <div className="col-span-12 md:col-span-3 mb-3 md:mb-0">
        <Text size={'md'} weight={'semiBold'}>
          User trail completion
        </Text>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-center mt-8 max-h-[180px]">
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#79D4F1] rounded-full"></div>
            <Text color="#79D4F1" size="sm">
              Completed
            </Text>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#B0E195] rounded-full"></div>
            <Text color="#B0E195" size="sm">
              Partially completed
            </Text>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-[#F7A400] rounded-full"></div>
            <Text color="#F7A400" size="sm">
              Not attempted
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTrailChart;
