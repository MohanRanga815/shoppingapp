// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productData: {},
    similarProducts: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductsData()
  }

  getFormatData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductsData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updateData = this.getFormatData(data)
      const updatedSimilarList = data.similar_products.map(eachProduct =>
        this.getFormatData(eachProduct),
      )
      this.setState({
        productData: updateData,
        similarProducts: updatedSimilarList,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#0b69ff" width="50" height="50" />
    </div>
  )

  renderFailure = () => (
    <div className="fail-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="fail-img"
      />
      <h1 className="fail-head">Product Not Found</h1>
      <Link to="/products">
        <button className="btn" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecrease = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrease = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductsView = () => {
    const {productData, quantity, similarProducts} = this.state
    const {
      availability,
      brand,
      imageUrl,
      description,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <div className="success-con">
        <div className="product-details-con">
          <img src={imageUrl} alt="product" className="image" />
          <div className="product-title-con">
            <h1 className="title">{title}</h1>
            <p className="price">Rs {price}/-</p>
            <div className="rating-review-con">
              <div className="rate-con">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-icon"
                />
              </div>
              <p className="review-count">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="label-con">
              <p className="avail-para">Available:</p>
              <p className="avail-value">{availability}</p>
            </div>
            <div className="label-con">
              <p className="avail-para">Brand:</p>
              <p className="avail-value">{brand}</p>
            </div>
            <hr className="hori-line" />
            <div className="quantity-con">
              <button
                type="button"
                className="btn-minus"
                onClick={this.onDecrease}
                data-testid="minus"
              >
                <BsDashSquare className="quantity-icon" />
              </button>
              <p className="quantity-num">{quantity}</p>
              <button
                type="button"
                className="btn-minus"
                onClick={this.onIncrease}
                data-testid="plus"
              >
                <BsPlusSquare className="quantity-icon" />
              </button>
            </div>
            <button type="button" className="cart">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-head">Similar Products</h1>
        <ul className="similar-lists">
          {similarProducts.map(each => (
            <SimilarProductItem productDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductsView()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="app-con">{this.renderProductDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails
