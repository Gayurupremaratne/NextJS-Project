import Image from 'next/image';
import img from '/public/images/icons/close-square.svg';
import { Button } from '../Button';

interface DialogProps {
  title: React.ReactNode;
  buttonName?: string;
  isOpen: boolean;
  onClose: () => void;
  onButtonClick?: () => void;
  children: React.ReactNode;
  className?: string; // Custom class name for width and height
  overlayClassName?: string; // Custom class name for overlay
  style?: React.CSSProperties; // Additional styles
  showFooter?: boolean;
}

function Dialog({
  title,
  buttonName,
  onClose,
  onButtonClick,
  children,
  className,
  isOpen,
  showFooter = true,
}: DialogProps) {
  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-opacity-50 bg-black">
      <div className={`relative ${className} bg-white shadow-lg`}>
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-tints-battleship-grey-tint-5 bg-gray-100 rounded-t-lg">
          {title}
          <button
            className="p-2 rounded-full hover:bg-gray-300 focus:outline-none focus:ring focus:ring-gray-400"
            onClick={onClose}
          >
            <Image alt="close" src={img} />
          </button>
        </div>
        {/* Content */}
        <div className="relative p-6 pt-0 flex-auto">{children}</div>
        {/* Footer */}
        {showFooter && (
          <div className="flex items-center justify-end px-6 py-4 bg-gray-100 rounded-b-lg">
            <Button
              intent="primary"
              onClick={() => {
                onClose();
                if (onButtonClick) {
                  onButtonClick();
                }
              }}
              size={'md'}
            >
              {buttonName}
            </Button>
          </div>
        )}
      </div>
    </div>
  ) : null;
}

export default Dialog;
