import { Button } from '@/components/atomic';
import Image from 'next/image';
import closeEye from '@/public/images/icons/eye-slash.svg';
import openEye from '@/public/images/icons/vuesax-linear-eye.svg';

interface Props {
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

export const PasswordVisibilityButton = ({
  showPassword,
  togglePasswordVisibility,
}: Props) => {
  return (
    <Button
      className="absolute inset-y-0 right-0 flex items-center pr-3"
      intent={'ghost'}
      onClick={togglePasswordVisibility}
      type="button"
    >
      {showPassword ? (
        <Image alt="open" height={16} src={openEye} width={16} />
      ) : (
        <Image alt="close" height={16} src={closeEye} width={16} />
      )}
    </Button>
  );
};
