import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '../Button';
import Image from 'next/image';
import img from '/public/images/icons/close-square.svg';
import { Text } from '@/components/atomic';

export enum ModalSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

export interface ModalProps {
  buttonFunction: () => void;
  buttontText: string;
  modalTitle?: string;
  children: React.ReactNode;
  size?: ModalSize;
  show: boolean;
  setShow: (value: boolean) => void;
  buttonCount?: number;
  confirmButtonText?: string;
  confirmButtonType?: 'button' | 'submit' | 'reset' | undefined;
  modalAutoCloseOnSubmit?: boolean;
}

export function AlertDialog({
  modalTitle,
  buttonFunction,
  children,
  buttontText,
  show,
  setShow,
  buttonCount,
  confirmButtonText = 'Keep',
  confirmButtonType = 'button',
  modalAutoCloseOnSubmit = true,
}: ModalProps) {
  return (
    <Transition appear as={Fragment} show={show}>
      <Dialog as="div" className="relative z-50" onClose={() => setShow(false)}>
        <div
          aria-hidden="true"
          className="fixed inset-0 bg-shades-jungle-green-shade-6/80"
        />
        {show && (
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="sm:w-full max-w-xl w-96 transform overflow-hidden bg-white text-left align-middle transition-all">
                  <div className="flex flex-row ml-10 mt-6 relative">
                    <Dialog.Title>
                      <Text intent={'dark'} size={'md'} weight={'semiBold'}>
                        {modalTitle}
                      </Text>
                    </Dialog.Title>
                    <button
                      className="absolute right-0 mr-10"
                      onClick={() => setShow(false)}
                      type="button"
                    >
                      <Image alt="close" src={img} />
                    </button>
                  </div>
                  <hr className="mt-5 border-tints-battleship-grey-tint-5" />
                  <div className="mt-6 ml-10 mr-10">{children}</div>

                  {buttonCount === 1 ? (
                    <div className="mt-9 flex justify-end mb-6 mr-10">
                      <Button
                        className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                        onClick={() => {
                          buttonFunction();
                        }}
                        type="submit"
                      >
                        {buttontText}
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-9 flex justify-end mb-6 mr-10 gap-6">
                      <Button
                        intent={'danger'}
                        onClick={() => {
                          buttonFunction();
                          if (modalAutoCloseOnSubmit) {
                            setShow(false);
                          }
                        }}
                      >
                        {buttontText}
                      </Button>
                      <Button
                        onClick={() =>
                          confirmButtonType === 'submit'
                            ? buttonFunction()
                            : setShow(false)
                        }
                        type={confirmButtonType}
                      >
                        {confirmButtonText}
                      </Button>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        )}
      </Dialog>
    </Transition>
  );
}

export default AlertDialog;
