import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SmallStar } from '../../../assets/particles/small_star.svg';
import StarMaker from '../../layout/star-maker/StarMaker';
import { ReactComponent as Decoration } from '../../../assets/particles/deco.svg';
import { ReactComponent as Starknet } from '../../../assets/particles/starknet.svg';
import { ReactComponent as Rocket } from '../../../assets/icons/rocket.svg';
import './home.css';
import { useWalletStore } from '../../../stores/useWalletStore';
import { notify } from '../../layout/notifier/Notifier';


function Home() {
      const { walletId } = useWalletStore();

  const navigate = useNavigate();

  const handleLaunchApp = async () => {
    if (walletId) {
      navigate('/form');
    } else {
      notify('Please connect to your wallet', "warning");
    }
  };

  const starsData = [
    { top: 15, left: 20 },
    { top: 20, left: 40 },
    { top: 15, left: 70 },
    { top: 15, left: 0 },
    { top: 90, left: 80 },
    { top: 60, left: 85 },
    { top: 40, left: 106 },
    { top: 85, left: 100 },
    { top: 90, left: 0 },
    { top: 75, left: 20 },
    { top: 50, left: 5 },
  ];

  const starData = [
    { top: 0, left: 5, size: 5 },
    { top: 26, left: 0, size: 7 },
    { top: 90, left: 10, size: 8 },
    { top: 0, left: 76, size: 8 },
    { top: 30, left: 88, size: 8 },
    { top: 70, left: 84, size: 10 },
  ];

  const decorationData = [
    { top: -5, left: -30 },
    { top: -5, left: 3 },
    { top: -15, left: 60 },
    { top: -14, left: 55 },
  ];

  return (
    <div className="home">
      <div className="container">
        <div>
          {decorationData.map((decoration, index) => (
            <Decoration
              key={index}
              className={`decoration decoration-${index}`}
              style={{
                '--top': `${decoration.top}vh`,
                '--left': `${decoration.left}vw`,
              }}
            />
          ))}
        </div>
        <div className="top-gradient"></div>
        <div>
          {starsData.map((star, index) => (
            <SmallStar
              key={index}
              className="small-star"
              style={{
                '--top': `${star.top}%`,
                '--left': `${star.left}%`,
              }}
            />
          ))}
          <StarMaker starData={starData} />

          <Starknet className="starknet" />
        </div>
        <div className="center-text-container">
          <h2 className="center-text">
            <span className="blue-color">Earn</span> by leveraging your <br /> assets
            <span className="text-gradient"> with Spotnet</span>
          </h2>
          <h5 className="maximize-potential">
            Maximize the potential of your resources and start earning today. Join <br /> Spotnet and unlock new
            opportunities to grow your wealth!
          </h5>
        </div>

        <button className="launch-button" onClick={handleLaunchApp}>
          <div className="btn-elements">
            <span className="button-text">Launch App</span>
            <Rocket className="rocket-icon" />
          </div>
        </button>
        <div className="bottom-gradient"></div>
      </div>
    </div>
  );
}

export default Home;
