const PoolHeader = () => {
  return (
    <div>
      <div className="relative flex mr-3">
        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#1a1a1a] bg-blue-900">
          <img
            src="src/assets/img/strkLogo.png"
            alt="STRK Token"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#1a1a1a] bg-gray-800 -ml-2">
          <img
            src="src/assets/img/ethLogo.png"
            alt="ETH Token"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
export default PoolHeader;
