import React from "react";
import BtnRender from './BtnRender';
import './ProductItem.css';

function ProductItem(props){

    const {product} = props;
    
    return(
        <div className="product_card">
            <img src={product.images.url} alt="" />

            <div className="product_box">
                <h2 title={product.title}>{product.title}</h2>
                <span>Rs.{product.fee}</span>
                <p>{product.description}</p>

            </div>
            
             <BtnRender product={product} />
        </div>
    )
}

export default ProductItem