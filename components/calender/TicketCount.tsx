import Image from 'next/image';
import { Text } from '../atomic';
import { InventoryType } from '@/types/inventory/inventory.type';

type Props = {
  count: InventoryType;
};

export const TicketCount = ({ count }: Props) => {
  return (
    <>
      <Image
        alt="Arrow Right"
        height={16}
        src={`${
          count.reservedQuantity === count.inventoryQuantity &&
          count.reservedQuantity === 0
            ? '/svg/ticket-white.svg'
            : '/svg/ticket.svg'
        }`}
        width={16}
      />
      <div className="flex flex-row items-center space-x-0">
        <Text
          className={`${
            count.reservedQuantity === count.inventoryQuantity &&
            count.reservedQuantity === 0
              ? 'text-white'
              : 'text-tints-forest-green-tint-3'
          }`}
          weight="semiBold"
        >
          {count.reservedQuantity}
        </Text>
        <Text
          className={`${
            count.reservedQuantity === count.inventoryQuantity &&
            count.reservedQuantity === 0
              ? 'text-white'
              : 'text-tints-forest-green-tint-3'
          }`}
          weight="semiBold"
        >
          /
        </Text>
        <Text
          className={`${
            count.reservedQuantity === count.inventoryQuantity &&
            count.reservedQuantity === 0
              ? 'text-white'
              : 'text-tints-forest-green-tint-3'
          }`}
          weight="semiBold"
        >
          {count.inventoryQuantity}
        </Text>
      </div>
    </>
  );
};
