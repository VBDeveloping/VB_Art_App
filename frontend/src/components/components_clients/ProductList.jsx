import React from "react";
import { Link } from 'react-router-dom';
import Card from "./Card";
import "./components.css";

const ProductList = ({ products }) => {
  return (
    <div className="ProductList_Container">
      <h2 className="ProductList_Title">Nossos Produtos</h2>
      <div className="ProductList_Grid">
        {products.map(product => (
          <Link to={`/products/${product.id}`} key={product.id} className='ProductList_Link'>
          <Card key={product.id} product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
