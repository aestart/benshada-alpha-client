import React, { Component } from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faTrash,
  faMinus,
  faPlus
} from "@fortawesome/free-solid-svg-icons";
import { Link, Redirect } from "react-router-dom";
import { ifSeller } from "../../actions/auth";

import login from "../Auth/Login/login.jpg";

import "./cart.css";
import { cartRemove, cartUpdate } from "../../actions/cart";
import HrFrComp from "../HrFrComp/HrFrComp";

class Cart extends Component {
  constructor(props) {
    super(props);

    this.state = { quantities: {} };
  }

  quantities = {};

  resetStateQty(product, qty) {
    let { _id, price, discountPercentage } = product;

    this.props.cartUpdate(product, qty);

    this.setState({
      quantities: {
        ...this.state.quantities,
        [_id]: {
          qty,
          total: function() {
            return this.qty * price;
          },
          discountedTotal: function() {
            return this.qty * price * (1 - discountPercentage / 100);
          }
        }
      }
    });
  }

  increaseQuantity(product) {
    let { _id } = product,
      qty = this.state.quantities[_id].qty + 1;

    this.resetStateQty(product, qty);
  }

  decreaseQuantity(product) {
    let { _id } = product,
      qty = this.state.quantities[_id].qty - 1;

    return qty === 0 ? "" : this.resetStateQty(product, qty);
  }

  renderCartProducts = products =>
    products.length < 1 ? (
      <div className="text-center p-5 my-5">
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="fa-10x text-primary mt-5 mb-4"
        />
        <h3 className="mb-2">Your Cart is Empty</h3>
        <Link to="/products" className="btn btn-primary text-white">
          Shop Products
        </Link>
      </div>
    ) : (
      <div className="my-5 py-5">
        <div className="container mt-2">
          <h4>My Cart {Object.keys(this.state.quantities).length} Items</h4>
        </div>

        {products.map((product, i) => {
          let { name, price, discountPercentage, _id } = product;
          this.quantities = {
            ...this.quantities,
            [_id]: {
              qty: this.props.cart.filter(product => product._id === _id)[0]
                .cartQty,
              total: function() {
                return this.qty * price;
              },
              discountedTotal: function() {
                return this.qty * price * (1 - discountPercentage / 100);
              }
            }
          };

          return (
            <div className="container shadow-sm bg-white mb-4 p-0" key={i}>
              <div className="d-flex">
                <div className="img-holder img-holder-cart">
                  <img src={login} className="img-fluid" alt="" />
                </div>
                <div className="text-left flex-grow-1 p-3">
                  <p className="lead mb-0">
                    <Link to={`/products?name=${name}`}>{name}</Link>
                  </p>
                  <p className="lead font-weight-bold text-primary mb-0">
                    {discountPercentage > 0 ? (
                      <>
                        <strike className="text-secondary mr-2">
                          <small>
                            &#x20A6;
                            {this.state.quantities[_id] &&
                              this.state.quantities[_id].total()}
                          </small>
                        </strike>
                        <span>
                          &#x20A6;
                          {this.state.quantities[_id] &&
                            this.state.quantities[_id].discountedTotal()}
                        </span>
                      </>
                    ) : (
                      <span>
                        &#x20A6;{" "}
                        {this.state.quantities[_id] &&
                          this.state.quantities[_id].total()}
                      </span>
                    )}
                  </p>
                  <div className="my-4">
                    {/* <p className="float-sm-left">
              Color
              <span className="bg-danger px-3 py-2 mr-2 rounded"></span>
              <span className="bg-success px-3 py-2 mr-2 rounded"></span>
              <span className="bg-primary px-3 py-2 mr-2 rounded"></span>
            </p> */}
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 border border-left-0 border-right-0 border-bottom-0">
                <div
                  className="text-primary float-left pointer"
                  onClick={() => {
                    delete this.state.quantities[_id];
                    this.props.cartRemove(product);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />{" "}
                  <span className="text-uppercase ml-2">remove</span>{" "}
                </div>
                <div className="text-primary float-right">
                  <FontAwesomeIcon
                    icon={faMinus}
                    onClick={() => this.decreaseQuantity(product)}
                    className="pointer"
                  />{" "}
                  <span className="text-uppercase mx-3 text-secondary">
                    {this.state.quantities[_id] &&
                      this.state.quantities[_id].qty}
                  </span>{" "}
                  <FontAwesomeIcon
                    icon={faPlus}
                    onClick={() => this.increaseQuantity(product)}
                    className="pointer"
                  />
                </div>
                <div className="clear"></div>
              </div>
            </div>
          );
        })}

        <div className="container">
          <h2 className="float-left">Total: </h2>
          <h2 className="float-right text-primary">
            &#x20A6;
            {Object.entries(this.state.quantities)
              .map(item => item[1].discountedTotal())
              .reduce((a, i) => a + i, 0)}
          </h2>
          <div className="clear"></div>
        </div>

        <div className="container text-uppercase text-right mt-5">
          <Link
            to="/products"
            className="btn bg-white text-primary ml-3 btn-lg"
          >
            Continue Shopping
          </Link>
          <Link to="/checkout" className="btn btn-primary ml-3 btn-lg">
            Checkout
          </Link>
        </div>
      </div>
    );

  componentDidMount() {
    this.setState({ quantities: this.quantities });
  }

  render() {
    let { user, cart } = this.props,
      type = user && user.type;

    return ifSeller(type) ? (
      <Redirect to={{ pathname: "/" }} />
    ) : (
      <HrFrComp>
        <div className="px-3">{this.renderCartProducts(cart)}</div>
      </HrFrComp>
    );
  }
}

const mapStateToProps = ({ cart, auth }) => ({ cart, user: auth.user });

export default connect(mapStateToProps, { cartRemove, cartUpdate })(Cart);
