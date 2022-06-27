import { useNavigate } from '@shopify/hydrogen';
import { FC, FormEvent, useState } from 'react';

type FormElements = Record<'password' | 'passwordConfirm', HTMLInputElement>;

type CallPasswordResetApiProps = Record<
  'id' | 'resetToken' | 'password',
  string
>;

type AccountPasswordResetFormProps = Record<'id' | 'resetToken', string>;

export const callPasswordResetApi = async ({
  id,
  resetToken,
  password,
}: CallPasswordResetApiProps) => {
  try {
    const res = await fetch(`/account/reset`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, resetToken, password }),
    });

    if (res.ok) {
      return {};
    } else {
      return res.json();
    }
  } catch (error: any) {
    return {
      error: error.toString(),
    };
  }
};

export const AccountPasswordResetForm: FC<AccountPasswordResetFormProps> = ({
  id,
  resetToken,
}) => {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState<
    string | null
  >(null);

  const passwordValidation = (form: HTMLFormElement & FormElements) => {
    setPasswordError(null);
    setPasswordConfirmError(null);

    let hasError = false;

    if (!form.password.validity.valid) {
      hasError = true;
      setPasswordError(
        form.password.validity.valueMissing
          ? 'Please enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }

    if (!form.passwordConfirm.validity.valid) {
      hasError = true;
      setPasswordConfirmError(
        form.password.validity.valueMissing
          ? 'Please re-enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }

    if (password !== passwordConfirm) {
      hasError = true;
      setPasswordConfirmError('The two password entered did not match.');
    }

    return hasError;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement & FormElements>) => {
    event.preventDefault();

    if (passwordValidation(event.currentTarget)) return;

    const response = await callPasswordResetApi({
      id,
      resetToken,
      password,
    });

    if (response.error) {
      setSubmitError(response.error);
      return;
    }

    navigate('/account');
  };

  return (
    <div className='flex justify-center px-4 my-24'>
      <div className='w-full max-w-md'>
        <h1 className='text-4xl'>Reset Password.</h1>
        <p className='mt-4'>Enter a new password for your account.</p>
        <form noValidate className='pt-6 pb-8 my-4' onSubmit={onSubmit}>
          {submitError && (
            <div className='flex justify-center items-center mb-6 bg-zinc-500'>
              <p className='m-4 text-s text-contrast'>{submitError}</p>
            </div>
          )}
          <div className='mb-3'>
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline ${
                passwordError ? ' border-red-500' : 'border-gray-900'
              }`}
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              placeholder='Password'
              aria-label='Password'
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={password}
              minLength={8}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            <p
              className={`text-red-500 text-xs ${
                !passwordError ? 'invisible' : ''
              }`}
            >
              {passwordError} &nbsp;
            </p>
          </div>
          <div className='mb-3'>
            <input
              className={`mb-1 appearance-none border w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline ${
                passwordConfirmError ? ' border-red-500' : 'border-gray-900'
              }`}
              id='passwordConfirm'
              name='passwordConfirm'
              type='password'
              autoComplete='current-password'
              placeholder='Re-enter password'
              aria-label='Re-enter password'
              value={passwordConfirm}
              required
              minLength={8}
              onChange={(event) => setPasswordConfirm(event.target.value)}
            />
            <p
              className={`text-red-500 text-xs ${
                !passwordConfirmError ? 'invisible' : ''
              }`}
            >
              {passwordConfirmError} &nbsp;
            </p>
          </div>
          <div className='flex justify-between items-center'>
            <button
              className='block py-2 px-4 w-full bg-gray-900 rounded text-contrast focus:shadow-outline'
              type='submit'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
