// Home.jsx
import { useNavigate } from '@tanstack/react-router';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={() => navigate('/about')}>Go to About</button>
    </div>
  );
};

export default Home;
