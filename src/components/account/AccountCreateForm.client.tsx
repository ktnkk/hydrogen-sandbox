import { useNavigate, Link } from '@shopify/hydrogen';
import { FormEvent, useState } from 'react';
import { emailValidation, passwordValidation } from '~/lib/utils';
import { callLoginApi } from './AccountLoginForm.client';

type CallAccountCreateApiProps = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export const callAccountCreateApi = async ({
  email,
  password,
  firstName,
  lastName,
}: CallAccountCreateApiProps) => {
  try {
    const res = await fetch(`/account/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    if (res.status === 200) {
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

export const AccountCreateForm = () => {
  const navigate = useNavigate();

  const [submitError, setSubmitError] = useState<null | string>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<null | string>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<null | string>(null);

  const onSubmit = async (
    event: FormEvent<
      HTMLFormElement & Record<'email' | 'password', HTMLInputElement>
    >,
  ) => {
    event.preventDefault();

    setEmailError(null);
    setPasswordError(null);
    setSubmitError(null);

    const newEmailError = emailValidation(event.currentTarget.email);
    if (newEmailError) setEmailError(newEmailError);

    const newPasswordError = passwordValidation(event.currentTarget.password);
    if (newPasswordError) setPasswordError(newPasswordError);

    if (newEmailError || newPasswordError) return;

    const accountCreateResponse = await callAccountCreateApi({
      email,
      password,
    });

    if (accountCreateResponse.error) {
      setSubmitError(accountCreateResponse.error);
      return;
    }

    await callLoginApi({
      email,
      password,
    });

    navigate('/account');
  };

  return (
    <div className='flex justify-center px-4 my-24'>
      <div className='w-full max-w-md'>
        <h1 className='text-4xl'>Create an Account.</h1>
        <form noValidate className='pt-6 pb-8 my-4' onSubmit={onSubmit}>
          {submitError && (
            <div className='flex justify-center items-center mb-6 bg-zinc-500'>
              <p className='m-4 text-s text-contrast'>{submitError}</p>
            </div>
          )}
          <div className='mb-3'>
            <input
              className={`mb-1 appearance-none rounded border w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline ${
                emailError ? ' border-red-500' : 'border-gray-900'
              }`}
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
              placeholder='Email address'
              aria-label='Email address'
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {!emailError ? (
              ''
            ) : (
              <p className={`text-red-500 text-xs`}>{emailError} &nbsp;</p>
            )}
          </div>
          <div className='mb-3'>
            <input
              className={`mb-1 appearance-none rounded border w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline ${
                passwordError ? ' border-red-500' : 'border-gray-900'
              }`}
              id='password'
              name='password'
              type='password'
              autoComplete='current-password'
              placeholder='Password'
              aria-label='Password'
              value={password}
              minLength={8}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            {!passwordError ? (
              ''
            ) : (
              <p className={`text-red-500 text-xs`}>{passwordError} &nbsp;</p>
            )}
          </div>
          <div className='flex justify-between items-center'>
            <button
              className='block py-2 px-4 w-full bg-gray-900 rounded text-contrast focus:shadow-outline'
              type='submit'
            >
              Create Account
            </button>
          </div>
          <div className='flex items-center mt-4'>
            <p className='text-sm align-baseline'>
              Already have an account? &nbsp;
              <Link className='inline underline' to='/account'>
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
