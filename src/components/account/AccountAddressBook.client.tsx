import { useState, useMemo, MouseEventHandler, FC } from 'react';
import {
  Text,
  Button,
  Modal,
  AccountDeleteAddress,
  AccountAddressEdit,
} from '~/components';

type AddressProps = {
  address: any;
  defaultAddress?: boolean;
  editAddress: (address: any) => void;
  setDeletingAddress: MouseEventHandler<HTMLButtonElement>;
};

type AccountAddressBookProps = {
  addresses: any[];
  defaultAddress: any;
};

const Address: FC<AddressProps> = ({
  address,
  defaultAddress,
  editAddress,
  setDeletingAddress,
}) => {
  return (
    <div className='flex flex-col p-6 rounded border border-gray-200 lg:p-8'>
      {defaultAddress ? (
        <div className='flex flex-row mb-3'>
          <span className='py-1 px-3 text-xs font-medium rounded-full bg-primary/20 text-primary/50'>
            Default
          </span>
        </div>
      ) : null}
      <ul className='flex-row flex-1'>
        {address.firstName || address.lastName ? (
          <li>
            {(address.firstName && address.firstName + ' ') + address.lastName}
          </li>
        ) : (
          <></>
        )}
        {address.formatted ? (
          address.formatted.map((line: string) => <li key={line}>{line}</li>)
        ) : (
          <></>
        )}
      </ul>

      <div className='flex flex-row mt-6 font-medium'>
        <button
          onClick={() => editAddress(address)}
          className='text-sm text-left underline'
        >
          Edit
        </button>
        <button
          onClick={setDeletingAddress}
          className='ml-6 text-sm text-left text-primary/50'
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export const AccountAddressBook: FC<AccountAddressBookProps> = ({
  addresses,
  defaultAddress,
}) => {
  const [editingAddress, setEditingAddress] = useState(null);
  const [deletingAddress, setDeletingAddress] = useState(null);

  const { fullDefaultAddress, addressesWithoutDefault } = useMemo(() => {
    const defaultAddressIndex = addresses.findIndex(
      (address) => address.id === defaultAddress,
    );
    return {
      addressesWithoutDefault: [
        ...addresses.slice(0, defaultAddressIndex),
        ...addresses.slice(defaultAddressIndex + 1, addresses.length),
      ],
      fullDefaultAddress: addresses[defaultAddressIndex],
    };
  }, [addresses, defaultAddress]);

  const close = () => {
    setEditingAddress(null);
    setDeletingAddress(null);
  };

  const editAddress = (address: any) => setEditingAddress(address);

  return (
    <>
      {deletingAddress ? (
        <Modal close={close}>
          <AccountDeleteAddress addressId={deletingAddress} close={close} />
        </Modal>
      ) : null}
      {editingAddress ? (
        <Modal close={close}>
          <AccountAddressEdit
            address={editingAddress}
            defaultAddress={fullDefaultAddress === editingAddress}
            close={close}
          />
        </Modal>
      ) : null}
      <div className='grid gap-4 p-4 py-6 w-full md:gap-8 md:p-8 lg:p-12'>
        <h3 className='text-lead font-bold'>Address Book</h3>
        <div>
          {!addresses?.length ? (
            <Text className='mb-1' width='narrow' as='p' size='copy'>
              You haven&apos;t saved any addresses yet.
            </Text>
          ) : null}
          <div className='w-48'>
            <Button
              className='mt-2 mb-6 w-full text-sm'
              onClick={() => editAddress({})}
              variant='secondary'
            >
              Add an Address
            </Button>
          </div>
          {addresses?.length ? (
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3'>
              {fullDefaultAddress ? (
                <Address
                  address={fullDefaultAddress}
                  defaultAddress
                  setDeletingAddress={setDeletingAddress.bind(
                    null,
                    fullDefaultAddress.originalId,
                  )}
                  editAddress={editAddress}
                />
              ) : null}
              {addressesWithoutDefault.map((address) => (
                <Address
                  key={address.id}
                  address={address}
                  setDeletingAddress={setDeletingAddress.bind(
                    null,
                    address.originalId,
                  )}
                  editAddress={editAddress}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
