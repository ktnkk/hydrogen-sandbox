import { IconClose } from '~/components';
import type { FC, ReactNode } from 'react';

type ModalProps = {
  children: ReactNode;
  close: () => void;
};

export const Modal: FC<ModalProps> = ({ children, close }) => {
  return (
    <div
      className='relative z-50'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'
      id='modal-bg'
    >
      <div className='fixed inset-0 transition-opacity bg-opacity/75 bg-primary/40'></div>
      <div className='overflow-y-auto fixed inset-0 z-50'>
        <div className='flex justify-center items-center p-4 min-h-full text-center sm:p-0'>
          <div
            className='overflow-hidden relative flex-1 px-4 pt-5 pb-4 text-left rounded shadow-xl transition-all sm:flex-none sm:p-6 sm:my-12 sm:w-full sm:max-w-sm bg-contrast'
            role='button'
            onClick={(e) => e.stopPropagation()}
            onKeyPress={(e) => e.stopPropagation()}
            tabIndex={0}
          >
            <div className='hidden absolute top-0 right-0 pt-4 pr-4 sm:block'>
              <button
                type='button'
                className='p-4 -m-4 transition text-primary hover:text-primary/50'
                onClick={close}
              >
                <IconClose aria-label='Close panel' />
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
