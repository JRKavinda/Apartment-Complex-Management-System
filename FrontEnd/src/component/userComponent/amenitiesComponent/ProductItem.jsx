import { useEffect, useState } from 'react';
import BtnRender from './BtnRender';
import './ProductItem.css';
import { Button } from '@mui/material';

function ProductItem({ product, state, handleCart, inCart }) {
  console.log(product.images)
  return (
    <div className="product_card">
      <img src={`http://localhost:5000/uploads/${product.images}` }alt="" />

      <div className="product_box">
        <h2 title={product.title}>{product.title}</h2>
        <span>Rs.{product.fee} </span>
        <p>{product.description} </p>
      </div>

      <BtnRender
        product={product}
        state={state}
        handleCart={handleCart}
        inCart={inCart}
      />
    </div>
  );
}

export default ProductItem;
