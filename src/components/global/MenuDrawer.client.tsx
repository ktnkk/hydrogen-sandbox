import { Link } from '@shopify/hydrogen';
import { Drawer, Text } from '~/components';
import type { EnhancedMenu } from '~/lib/utils';
import type { FC } from 'react';

type MenuMobileNavProps = {
  menu: EnhancedMenu;
  onClose: () => void;
};

type MenuDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  menu: EnhancedMenu;
};

const MenuMobileNav: FC<MenuMobileNavProps> = ({ menu, onClose }) => {
  return (
    <nav className='grid gap-4 p-6 sm:gap-6 sm:py-8 sm:px-12'>
      {(menu?.items || []).map((item) => (
        <Link key={item.id} to={item.to} target={item.target} onClick={onClose}>
          <Text as='span' size='copy'>
            {item.title}
          </Text>
        </Link>
      ))}
    </nav>
  );
};

export const MenuDrawer: FC<MenuDrawerProps> = ({ isOpen, onClose, menu }) => {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom='left' heading='Menu'>
      <div className='grid'>
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
};
