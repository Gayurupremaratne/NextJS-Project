'use client';
import { DataTable } from '@/components/atomic';
import { Subject, UserActions } from '@/constants/userPermissions';
import { useEffect, useState } from 'react';
import { columns } from './reportedAssetColumns';
import CustomCan from '@/components/casl/CustomCan';
import { IReportedImage } from '@/types/reported-images/reported-images';
import { useGetAllReportedImages } from '@/hooks/reported-images/reported-images';

const ViewAllReportedAssetsDashboardWidget = () => {
  const [sortBy, setSortBy] = useState('updatedAt');
  const { data: reportedImages } = useGetAllReportedImages(
    10,
    1,
    status,
    sortBy,
  );

  const [reports, setReports] = useState<IReportedImage[]>([]);

  useEffect(() => {
    if (reportedImages) {
      setReports(reportedImages.data.data.data);
    }
  }, [reportedImages, sortBy]);

  return (
    <CustomCan
      a={Subject.DashboardReportedContent}
      I={UserActions.Read}
      isForbidden={true}
    >
      <div className="w-full">
        <DataTable<IReportedImage>
          border={false}
          columns={columns()}
          currentPage={0}
          data={reports}
          onPageChange={() => {}}
          setSortBy={e => {
            setSortBy(e);
          }}
          totalPages={0}
        />
      </div>
    </CustomCan>
  );
};
export default ViewAllReportedAssetsDashboardWidget;
