function Card({ label, icon, value = '', cardData = [] }) {
  return (
    <div className="w-[317px] h-[101px] bg-transparent border border-light-purple rounded-lg px-[24px] pt-[4px] text-center">
      <div className="flex justify-center items-center border-none text-second-primary">
        {icon}
        <span className="text-[14px] font-semibold">{label}</span>
      </div>
      <div className="text-[24px] font-semibold text-second-primary h-fit">
        {cardData.length > 0 ? (
          <>
            <span className="text-inherit  mr-1">$</span>
            <span className="text-[24px]">
              {' '}
              {cardData[1]?.balance ? Number(cardData[1].balance).toFixed(8) : '0.00'}
            </span>
          </>
        ) : (
          <span className="text-[24px]">{value}</span>
        )}
      </div>
    </div>
  );
}

export default Card;
