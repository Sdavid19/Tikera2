import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../services/movieApi'; // vagy ahol létrehoztad
import toast from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password }).unwrap();
      toast.success("Successfully logged in!")
      navigate('/');
    } catch (error) {
      toast.success("Error logging in!")
      setErrorMsg('Error logging in!');
      console.error(error);
    }
  };

  return (
    <div className="p-5 grid place-items-center mt-5" style={{ height: '60vh' }}>
      <h1 className="text-4xl text-center">Login</h1>
      <form onSubmit={handleSubmit} className="grid gap-10 place-items-center w-full max-w-sm">
        <input
          type="text"
          placeholder="Email"
          className="input bg-white text-black w-100"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input bg-white text-black w-100"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn btn-success w-30" disabled={isLoading}>
          {isLoading ? 'Login...' : 'Login'}
        </button>
      </form>
      <p className="text-red-500 mt-3 h-10">{errorMsg}</p>
    </div>
  );
}

export default Login;
