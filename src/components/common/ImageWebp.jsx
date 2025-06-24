const ImageWithWebp = ({ src, width, height, alt, className, style }) => {
  const webpUrl = src.replace('/images/', '/webp/').replace(/\.[^.]+$/, '.webp');
  return <img src={webpUrl} width={width} height={height} style={style} alt={alt} loading='lazy' className={className} draggable='false' />;
};

export default ImageWithWebp;
