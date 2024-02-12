import { Text } from '@/components/atomic';

const TranslationFormHeader = () => {
  return (
    <div className="flex-col gap-6">
      <div className="flex gap-3 mb-5">
        <Text size={'md'} weight={'normal'}>
          Translations
        </Text>
        <Text
          className="flex items-center justify-center text-tints-battleship-grey-tint-2 gap-3"
          size={'sm'}
          weight={'normal'}
        >
          (Changes will be saved automatically)
        </Text>
      </div>
    </div>
  );
};

export default TranslationFormHeader;
