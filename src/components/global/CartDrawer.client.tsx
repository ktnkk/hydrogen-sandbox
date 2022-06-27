import { CartDetails, Drawer } from '~/components';
import type { FC } from 'react';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const CartDrawer: FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  return (
    <Drawer open={isOpen} onClose={onClose} heading='Cart' openFrom='right'>
      <div className='grid'>
        <CartDetails layout='drawer' onClose={onClose} />
      </div>
    </Drawer>
  );
};
