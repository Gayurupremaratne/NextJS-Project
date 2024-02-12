import { Heading, Text } from '../atomic';

export const InventoryCard = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <div className="bg-white space-y-2 border min-w-[145px] border-tints-battleship-grey-tint-5/80 drop-shadow-[0_10px_08px_rgba(0,0,0,0.03)] p-4 h-24 rounded-lg">
      <Text size={'md'} weight={'medium'}>
        {title}
      </Text>
      <Heading intent={'h2'}>{value}</Heading>
    </div>
  );
};
