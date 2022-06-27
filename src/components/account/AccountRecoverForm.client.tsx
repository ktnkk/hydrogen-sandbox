import { FormEvent, useState } from 'react';
import { emailValidation } from '~/lib/utils';

type CallAccountRecoverApiProps = {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

export const callAccountRecoverApi = async ({
  email,
  password,
  firstName,
  lastName,
}: CallAccountRecoverApiProps) => {
  try {
    const res = await fetch(`/account/recover`, {
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

export const AccountRecoverForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const onSubmit = async (
    event: FormEvent<HTMLFormElement & { email: HTMLInputElement }>,
  ) => {
    event.preventDefault();

    setEmailError(null);
    setSubmitError(null);

    const newEmailError = emailValidation(event.currentTarget.email);

    if (newEmailError) {
      setEmailError(newEmailError);
      return;
    }

    await callAccountRecoverApi({ email });

    setEmail('');
    setSubmitSuccess(true);
  };

  return (
    <div className='flex justify-center px-4 my-24'>
      <div className='w-full max-w-md'>
        {submitSuccess ? (
          <>
            <h1 className='text-4xl'>Request Sent.</h1>
            <p className='mt-4'>
              If that email address is in our system, you will receive an email
              with instructions about how to reset your password in a few
              minutes.
            </p>
          </>
        ) : (
          <>
            <h1 className='text-4xl'>Forgot Password.</h1>
            <p className='mt-4'>
              Enter the email address associated with your account to receive a
              link to reset your password.
            </p>
          </>
        )}
        <form noValidate className='pt-6 pb-8 my-4' onSubmit={onSubmit}>
          {submitError && (
            <div className='flex justify-center items-center mb-6 bg-zinc-500'>
              <p className='m-4 text-s text-contrast'>{submitError}</p>
            </div>
          )}
          <div className='mb-3'>
            <input
              className={`mb-1 rounded appearance-none border w-full py-2 px-3 text-primary/90 placeholder:text-primary/50 leading-tight focus:shadow-outline ${
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
          <div className='flex justify-between items-center'>
            <button
              className='block py-2 px-4 w-full bg-gray-900 rounded text-contrast focus:shadow-outline'
              type='submit'
            >
              Request Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
