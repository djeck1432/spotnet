// About.jsx
import { useNavigate } from '@tanstack/react-router';

const About = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>About Page</h1>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default About;
