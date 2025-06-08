import './App.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Login, SignUp } from './components/Auth';
import { AddMovie, AddScreening } from './components/Admin';
import { Toaster } from 'react-hot-toast'; // 👉 import toast container

function AppContent() {
  return (
    <Router>
      <Toaster position="top-center" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/addMovie" element={<AddMovie />} />
        <Route path="/admin/addMovie/:id" element={<AddMovie />} />
        <Route path="/admin/addScreening" element={<AddScreening />} />
        <Route path="/admin/addScreening/:id" element={<AddScreening />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
