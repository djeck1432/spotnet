const Total = (props: { total: number }) => {
    const { total } = props
    return (
        <div className="pagination-total">
            Total <span>{total}</span> Items
        </div>
    )
}

export default Total
