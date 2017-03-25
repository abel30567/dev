import React from 'react';
import ReactDOM from 'react-dom'; 
import Product from './product.jsx';

ReactDOM.render(
    <Product name="product" />,
    document.querySelector( '#product-container' )
);