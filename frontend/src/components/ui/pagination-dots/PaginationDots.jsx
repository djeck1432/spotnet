const PaginationDots = ({ balances, activeIndex, onDotClick }) => {
    const numberOfDots = Math.ceil(balances.length / 2);
  
    return (
      <div className="pagination">
        {Array.from({ length: numberOfDots }).map((_, index) => (
          <div
            key={index}
            className={`dot ${activeIndex === index ? "active" : ""}`}
            onClick={() => onDotClick(index)}
          ></div>
        ))}
      </div>
    );
  };
  
  export default PaginationDots;
  