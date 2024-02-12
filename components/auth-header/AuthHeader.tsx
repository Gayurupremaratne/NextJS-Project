import { Heading, Text } from '@/components/atomic';

interface AuthHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
}

export function AuthHeader({
  heading,
  text,
  className,
  children,
  ...props
}: AuthHeaderProps) {
  return (
    <div className={`${className} w-full sm:w-[432px] mx-auto`} {...props}>
      <Heading className="mt-16 text-center" intent={'h1'} size={'4xl'}>
        {heading}
      </Heading>
      <Text className="mt-4 text-center m-6" size={'md'}>
        {text}
      </Text>
      {children}
    </div>
  );
}
