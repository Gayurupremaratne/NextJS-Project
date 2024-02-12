export const DashboardCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`${className} bg-white space-y-2 border min-w-[145px] border-tints-battleship-grey-tint-5/80 drop-shadow-[0_10px_08px_rgba(0,0,0,0.03)] h-24 rounded-lg`}
    >
      {children}
    </div>
  );
};
