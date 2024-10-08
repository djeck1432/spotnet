import './dont_miss.css'
import React from "react";
import { ReactComponent as Rocket } from "../../../assets/icons/rocket.svg";
import { ReactComponent as Hand } from "../../../assets/images/hand.svg";
import { ReactComponent as Star } from "../../../assets/particles/star.svg";
import {useNavigate} from "react-router-dom";

const DontMiss = ({ walletId }) => {
    const navigate = useNavigate();

    const handleLaunchApp = async () => {
        if (walletId) {
            navigate('/form')
        } else {
            alert('Please connect to your wallet')
        }
    };
    const starData = [
        { top: 20, left: 5, size: 9 },
        { top: 75, left: 80, size: 12 },
    ]
    return(
        <div className='dont-miss__container'>
            <h1 className='miss-title'>Don't miss out</h1>
            <p className='miss-description'>
                Investing wisely would be the smartest move you'll make!
            </p>
            {starData.map((star, index) => (
                <Star key={index} style={{
                    position: 'absolute',
                    top: `${star.top}%`,
                    left: `${star.left}%`,
                    width: `${star.size}%`,
                    height: `${star.size}%`
                }}/>
            ))}
                <div className='miss-button'>
                    <button className='launch-button' onClick={handleLaunchApp}>
                        Launch App <Rocket/>
                    </button>
                    <Hand className='hand-icon'/>
                </div>
        </div>
    )
}

export default DontMiss