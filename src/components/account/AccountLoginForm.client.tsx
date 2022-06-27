import { useNavigate, Link } from '@shopify/hydrogen';
import { FC, FormEvent, useState } from 'react';

type CallLoginApiProps = Record<'email' | 'password', string>;

type EmailFieldProps = {
  email: string;
  setEmail: (email: string) => void;
  emailError: null | string;
  shopName: string;
};

type ValidEmailProps = {
  email: string;
  resetForm: () => void;
};

type PasswordFieldProps = {
  password: string;
  setPassword: (password: string) => void;
  passwordError: null | string;
};

type FormElements = Record<'email' | 'password', HTMLInputElement>;

export const callLoginApi = async ({ email, password }: CallLoginApiProps) => {
  try {
    const res = await fetch(`/account/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
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

const EmailField: FC<EmailFieldProps> = ({
  email,
  setEmail,
  emailError,
  shopName,
}) => {
  return (
    <>
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
      <div className='flex justify-between items-center'>
        <button
          className='block py-2 px-4 w-full bg-gray-900 rounded text-contrast focus:shadow-outline'
          type='submit'
        >
          Next
        </button>
      </div>
      <div className='flex items-center mt-8 border-t  border-gray-300'>
        <p className='mt-6 text-sm align-baseline'>
          New to {shopName}? &nbsp;
          <Link className='inline underline' to='/account/register'>
            Create an account
          </Link>
        </p>
      </div>
    </>
  );
};

const ValidEmail: FC<ValidEmailProps> = ({ email, resetForm }) => {
  return (
    <div className='flex justify-between items-center mb-3'>
      <div>
        <p>{email}</p>
        <input
          className='hidden'
          type='text'
          autoComplete='username'
          value={email}
          readOnly
        ></input>
      </div>
      <div>
        <button
          className='inline-block text-sm underline align-baseline'
          type='button'
          onClick={resetForm}
        >
          Change email
        </button>
      </div>
    </div>
  );
};

const PasswordField: FC<PasswordFieldProps> = ({
  password,
  setPassword,
  passwordError,
}) => {
  return (
    <>
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
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(event) => setPassword(event.target.value)}
        />
        {!passwordError ? (
          ''
        ) : (
          <p className={`text-red-500 text-xs`}> {passwordError} &nbsp;</p>
        )}
      </div>
      <div className='flex justify-between items-center'>
        <button
          className='block py-2 px-4 w-full bg-gray-900 rounded text-contrast focus:shadow-outline'
          type='submit'
        >
          Sign in
        </button>
      </div>
      <div className='flex justify-between items-center mt-4'>
        <div className='flex-1'></div>
        <Link
          className='inline-block text-sm align-baseline text-primary/50'
          to='/account/recover'
        >
          Forgot password
        </Link>
      </div>
    </>
  );
};

export const AccountLoginForm: FC<{ shopName: string }> = ({ shopName }) => {
  const navigate = useNavigate();

  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [showEmailField, setShowEmailField] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<null | string>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<null | string>(null);

  const checkEmail = (event: FormEvent<HTMLFormElement & FormElements>) => {
    if (event.currentTarget.email.validity.valid) {
      setShowEmailField(false);
    } else {
      setEmailError('Please enter a valid email');
    }
  };

  const resetForm = () => {
    setShowEmailField(true);
    setEmail('');
    setEmailError(null);
    setPassword('');
    setPasswordError(null);
  };

  const checkPassword = async (
    event: FormEvent<HTMLFormElement & FormElements>,
  ) => {
    const validity = event.currentTarget.password.validity;
    if (validity.valid) {
      const response = await callLoginApi({
        email,
        password,
      });

      if (response.error) {
        setHasSubmitError(true);
        resetForm();
      } else {
        navigate('/account');
      }
    } else {
      setPasswordError(
        validity.valueMissing
          ? 'Please enter a password'
          : 'Passwords must be at least 6 characters',
      );
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement & FormElements>) => {
    event.preventDefault();

    setEmailError(null);
    setHasSubmitError(false);
    setPasswordError(null);

    if (showEmailField) {
      checkEmail(event);
    } else {
      checkPassword(event);
    }
  };

  return (
    <div className='flex justify-center px-4 my-24'>
      <div className='w-full max-w-md'>
        <h1 className='text-4xl'>Sign in.</h1>
        <form noValidate className='pt-6 pb-8 my-4' onSubmit={onSubmit}>
          {hasSubmitError && (
            <div className='flex justify-center items-center mb-6 bg-zinc-500'>
              <p className='m-4 text-s text-contrast'>
                Sorry we did not recognize either your email or password. Please
                try to sign in again or create a new account.
              </p>
            </div>
          )}
          {showEmailField && (
            <EmailField
              shopName={shopName}
              email={email}
              setEmail={setEmail}
              emailError={emailError}
            />
          )}
          {!showEmailField && (
            <ValidEmail email={email} resetForm={resetForm} />
          )}
          {!showEmailField && (
            <PasswordField
              password={password}
              setPassword={setPassword}
              passwordError={passwordError}
            />
          )}
        </form>
      </div>
    </div>
  );
};
