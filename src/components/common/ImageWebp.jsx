const ImageWithWebp = ({ src, width = 800, height, alt, className }) => {
  const webpUrl = src.replace('/images/', '/webp/').replace(/\.[^.]+$/, '.webp');
  return <img src={webpUrl} width={width} height={height} alt={alt} loading='lazy' className={className} draggable='false' />;
};

export default ImageWithWebp;
