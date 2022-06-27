// @ts-expect-error @headlessui/react incompatibility with node16 resolution
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode, useState } from 'react';
import { Heading, IconClose } from '~/components';

type DrawerProps = {
  heading?: string;
  open: boolean;
  onClose: () => void;
  openFrom: 'right' | 'left';
  children: ReactNode;
};

/**
 * Drawer component that opens on user click.
 * @param heading - string. Shown at the top of the drawer.
 * @param open - boolean state. if true opens the drawer.
 * @param onClose - function should set the open state.
 * @param openFrom - right, left
 * @param children - react children node.
 */
export const Drawer = ({
  heading,
  open,
  onClose,
  openFrom = 'right',
  children,
}: DrawerProps) => {
  const offScreen = {
    right: 'translate-x-full',
    left: '-translate-x-full',
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0 left-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity/25' />
        </Transition.Child>

        <div className='fixed inset-0'>
          <div className='overflow-hidden absolute inset-0'>
            <div
              className={`fixed inset-y-0 flex max-w-full ${
                openFrom === 'right' ? 'right-0' : ''
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-300'
                enterFrom={offScreen[openFrom]}
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-300'
                leaveFrom='translate-x-0'
                leaveTo={offScreen[openFrom]}
              >
                <Dialog.Panel className='w-screen max-w-lg h-screen text-left align-middle shadow-xl transition-all bg-contrast'>
                  <header
                    className={`sticky top-0 flex items-center px-6 h-nav sm:px-8 md:px-12 ${
                      heading ? 'justify-between' : 'justify-end'
                    }`}
                  >
                    {heading !== null && (
                      <Dialog.Title>
                        <Heading as='span' size='lead' id='cart-contents'>
                          {heading}
                        </Heading>
                      </Dialog.Title>
                    )}
                    <button
                      type='button'
                      className='p-4 -m-4 transition text-primary hover:text-primary/50'
                      onClick={onClose}
                    >
                      <IconClose aria-label='Close panel' />
                    </button>
                  </header>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

Drawer.Title = Dialog.Title;

export const useDrawer = (openDefault = false) => {
  const [isOpen, setIsOpen] = useState(openDefault);
  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  return {
    isOpen,
    openDrawer,
    closeDrawer,
  };
};
