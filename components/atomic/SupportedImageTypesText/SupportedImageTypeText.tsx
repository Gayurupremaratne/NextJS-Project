import { Text } from '@/components/atomic';
export interface SupportedImageTypesTextProps {
  text: string;
}

export const SupportedImageTypesText = ({
  text,
}: SupportedImageTypesTextProps) => {
  return (
    <Text intent="green" size="xs" type="p">
      {text}
    </Text>
  );
};
