// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {title, brand, imageUrl, rating, price} = productDetails

  return (
    <li className="list-products">
      <img src={imageUrl} alt={`similar products ${title}`} className="image" />
      <p className="title">{title}</p>
      <p className="brand">by {brand}</p>
      <div className="label-price-con">
        <p className="price">Rs{price}/-</p>
        <div className="rating-con">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-icon"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
