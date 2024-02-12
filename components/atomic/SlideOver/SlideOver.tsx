'use client';

import { Fragment, ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Heading } from '../Text';
import Image from 'next/image';
import img from '/public/images/icons/close-square.svg';
interface Props {
  children: ReactNode;
}

interface IProps {
  show: boolean;
  title: string;
  children: ReactNode;
  setShow: (value: boolean) => void;
}

const BackgroundLayer = () => (
  <Transition.Child
    enter="ease-in-out duration-0"
    enterFrom="opacity-90"
    enterTo="opacity-100"
    leave="ease-in-out duration-0"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div className="z-50 fixed inset-0 bg-black opacity-70" />
  </Transition.Child>
);

const SlideOverLayer = ({ children }: Props) => (
  <Transition.Child
    as={Fragment}
    enter="transform transition ease-in-out duration-500"
    enterFrom="translate-x-full"
    enterTo="translate-x-0"
    leave="transform transition ease-in-out duration-500 delay-100"
    leaveFrom="translate-x-0"
    leaveTo="translate-x-full"
  >
    <div className="z-50 fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="pointer-events-none fixed inset-y-0 right-0 sm:w-3/4 w-11/12 sm:pl-10 pl-0">
          <div className="pointer-events-auto h-full">
            <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
              <div className="">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition.Child>
);

const SlideOver = ({ show, setShow, title, children }: IProps) => {
  const handleClose = () => {
    setShow(false);
  };
  return (
    <Transition.Root className="z-50" show={show}>
      <BackgroundLayer />
      <Dialog as="div" onClose={handleClose}>
        <SlideOverLayer>
          <div className="flex flex-row ml-10 my-6 relative">
            <Heading intent={'h4'}>{title}</Heading>

            <button
              className="absolute right-0 mr-14"
              onClick={handleClose}
              type="button"
            >
              <Image alt="close" src={img} />
            </button>
          </div>
          <hr className="flex border-b border-tints-battleship-grey-tint-5 my-4" />
          <div className="mx-10 mt-10">{children}</div>
        </SlideOverLayer>
      </Dialog>
    </Transition.Root>
  );
};

export default SlideOver;
