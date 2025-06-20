const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <>
      {Array(fullStars)
        .fill()
        .map((_, i) => (
          <i key={`f-${i}`} className='fas fa-star' />
        ))}
      {halfStar && <i className='fas fa-star-half-alt' />}
      {Array(emptyStars)
        .fill()
        .map((_, i) => (
          <i key={`e-${i}`} className='far fa-star' />
        ))}
    </>
  );
};

export default StarRating;
