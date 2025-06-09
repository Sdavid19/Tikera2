import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../services/movieApi';
import toast from 'react-hot-toast';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFieldErrors({});

    try {
      await register({ name, email, password, passwordAgain }).unwrap();
      toast.success("Successful register!")
      navigate('/login');
    } catch (error) {
      const apiError = error?.data;
      toast.error("Error signing up!")
      setErrorMsg(apiError?.message || 'Error signing up!');
      setFieldErrors(apiError?.errors || {});
    }
  };

  const renderFieldError = (fieldName) => (
    <div className="text-sm text-red-500 min-h-[1.5rem] mt-1">
      {fieldErrors[fieldName]?.[0] || ''}
    </div>
  );

  return (
    <div className="p-5 grid place-items-center mt-5 mb-2" style={{ height: '70vh' }}>
      <h1 className="text-4xl text-center">Sign up</h1>
      <form onSubmit={handleSubmit} className="grid gap-5 place-items-center w-full max-w-sm">

        <div className="w-full">
          <input
            type="text"
            placeholder="Név"
            className="input bg-white text-black w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {renderFieldError('name')}
        </div>

        <div className="w-full">
          <input
            type="email"
            placeholder="Email"
            className="input bg-white text-black w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {renderFieldError('email')}
        </div>

        <div className="w-full">
          <input
            type="password"
            placeholder="Jelszó"
            className="input bg-white text-black w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {renderFieldError('password')}
        </div>

        <div className="w-full">
          <input
            type="password"
            placeholder="Jelszó ismét"
            className="input bg-white text-black w-full"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
          />
           {renderFieldError('password')}
        </div>

        <button type="submit" className="btn btn-success w-full" disabled={isLoading}>
          {isLoading ? 'Sign up...' : 'Sign up'}
        </button>
      </form>

      <p
        className="text-red-500 mt-3"
        style={{ minHeight: '1.5rem', maxHeight: '1.5rem', overflow: 'hidden' }}
      >
        {errorMsg}
      </p>
    </div>
  );
}

export default Signup;
