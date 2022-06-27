import type { ButtonHTMLAttributes, FC } from 'react';

type ButtonProps = {
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const LogoutButton: FC<ButtonProps> = ({ onClick, ...props }) => {
  const logout = () => {
    fetch('/account/logout', { method: 'POST' }).then(() => {
      if (typeof onClick === 'function') onClick();
      window.location.href = '/';
    });
  };

  return (
    <button className='text-primary/50' {...props} onClick={logout}>
      Logout
    </button>
  );
};
