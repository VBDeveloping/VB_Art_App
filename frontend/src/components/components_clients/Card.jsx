import React from "react";
import "./components.css";

const Card = ({ product }) => {
  return (
    <div className="Card_Container">
      <div className='Card_Image_Wrapper'>
        <img src={product.image_url} alt={product.name} className='Card_Image' />
      </div>
      <div className='Card_Info'>
        <h3 className='Card_Title'>{product.name}</h3>
        <p className='Card_Price'>R$ {(parseFloat(product.price)).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Card;
