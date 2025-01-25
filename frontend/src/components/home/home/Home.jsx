import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as SmallStar } from '../../../assets/particles/small_star.svg';
import StarMaker from '../../layout/star-maker/StarMaker';
import { ReactComponent as Decoration } from '../../../assets/particles/deco.svg';
import { ReactComponent as Starknet } from '../../../assets/particles/starknet.svg';
import { ReactComponent as Rocket } from '../../../assets/icons/rocket.svg';
import { useWalletStore } from '../../../stores/useWalletStore';
import { notify } from '../../layout/notifier/Notifier';

function Home() {
  const { walletId } = useWalletStore();

  const navigate = useNavigate();

  const handleLaunchApp = async () => {
    if (walletId) {
      navigate('/form');
    } else {
      notify('Please connect to your wallet', 'warning');
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
    <div className="relative flex flex-col justify-center text-center w-full pointer-events-auto">
      <div className="mt-[400px] mb-[200px] h-full md:mt-[250px] md:mb-[150px] sm:mt-[200px] sm:mb-[100px]">
        <div>
          {decorationData.map((decoration, index) => (
            <Decoration
              key={index}
              className={`absolute -z-1 
                ${index === 0 ? 'w-[40%] h-[40%] sm:w-[40%] sm:h-[40%] md:w-[65%] md:h-[65%] xl:w-[80%] xl:h-[80%]' 
                  : index === 1 ? 'w-[30%] h-[30%] md:w-[20%] md:h-[20%] xl:w-[30%] xl:h-[30%]' 
                  : index === 2 ? 'w-[45%] h-[45%] sm:w-[50%] sm:h-[43%] md:w-[40%] md:h-[40%] xl:w-[45%] xl:h-[45%]' 
                  : index === 3 ? 'w-[75%] h-[75%] md:w-[55%] md:h-[55%] xl:w-[70%] xl:h-[70%]' 
                  : ''}
                `}
              style={{
                top: `${decoration.top}%`,
                left: `${decoration.left}%`,
              }}
            />
          ))}
        </div>
        <div className="bg-main-gradient h-[100px] mb-[100px] w-[60%] m-0 rounded-t-[2000px] blur-[100px] -z-1 absolute left-1/2 -translate-x-1/2 top-[-50px]"></div>
        <div>
          {starsData.map((star, index) => (
            <SmallStar
              key={index}
              className="absolute -z-1"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
              }}
            />
          ))}
          <StarMaker starData={starData} />

          <Starknet className="absolute top-0 right-5 -z-1 w-[15px] md:w-[15px] lg:w-[30px] h-auto" />
        </div>
        <div className="flex justify-center items-center flex-col">
          <h2
            className="font-text text-primary mx-auto text-center leading-[95%]
  text-[35px] sm:text-[35px] md:text-[40px] lg:text-[45px] xl:text-[70px]
  lg:-z-1"
          >
            <span className="text-brand">Earn</span> <span className="text-white">by leveraging your <br /> assets</span>
            <span className="bg-main-gradient bg-clip-text text-transparent"> with Spotnet</span>
          </h2>
          <h5
            className="text-white font-normal -z-1
  text-[10px] sm:text-[10px] md:text-[10px] lg:text-[12px] xl:text-[17px] 2xl:text-[17px]
  mt-2 sm:mt-2 md:mt-2 lg:mt-2.5 xl:mt-3 2xl:mt-3"
          >
            Maximize the potential of your resources and start earning today. Join <br /> Spotnet and unlock new
            opportunities to grow your wealth!
          </h5>
        </div>

        <button
          className="bg-button-gradient border-none rounded-lg h-[60px] w-[400px] text-xl font-text font-bold transition-colors duration-[1.3s] mt-5 z-10 pointer-events-auto "
          onClick={handleLaunchApp}
        >
          <div className="flex justify-center items-center">
            <span className="text-[21px] text-black">Launch App</span>
            <Rocket className="w-6 h-6 ml-2" />
          </div>
        </button>
        <div className="bg-main-gradient mt-[100px] h-[100px] w-[60%] m-0 rounded-t-[2000px] blur-[100px] -z-1 absolute left-1/2 -translate-x-1/2 bottom-[-50px]"></div>
      </div>
    </div>
  );
}

export default Home;
