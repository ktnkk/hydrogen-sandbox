import { Text, Button } from '~/components/elements';
import { useRenderServerComponents } from '~/lib/utils';
import type { FC } from 'react';

type AccountDeleteAddressProps = {
  addressId: string;
  close: () => void;
};

export const callDeleteAddressApi = async (id: string) => {
  try {
    const res = await fetch(`/account/address/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    });
    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (_e) {
    return {
      error: 'Error removing address. Please try again.',
    };
  }
};

export const AccountDeleteAddress: FC<AccountDeleteAddressProps> = ({
  addressId,
  close,
}) => {
  const renderServerComponents = useRenderServerComponents();

  const deleteAddress = async (id: string) => {
    const response = await callDeleteAddressApi(id);
    if (response.error) {
      alert(response.error);
      return;
    }
    renderServerComponents();
    close();
  };

  return (
    <>
      <Text className='mb-4' as='h3' size='lead'>
        Confirm removal
      </Text>
      <Text as='p'>Are you sure you wish to remove this address?</Text>
      <div className='mt-6'>
        <Button
          className='text-sm'
          onClick={() => deleteAddress(addressId)}
          variant='primary'
          width='full'
        >
          Confirm
        </Button>
        <Button
          className='mt-2 text-sm'
          onClick={close}
          variant='secondary'
          width='full'
        >
          Cancel
        </Button>
      </div>
    </>
  );
};
