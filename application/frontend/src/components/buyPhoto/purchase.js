import React from 'react';
import './purchase.css';
import Header from '../Header/header';

const Purchase = () => {
  const [quantity, setQuantity] = React.useState(1);
  const [totalPrice, setTotalPrice] = React.useState(10);

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    setQuantity(newQuantity);
    setTotalPrice(newQuantity * 10);
  };

  const handlePurchase = () => {
    // Perform purchase logic here, such as making an API call to a payment processor
    alert(`You have purchased ${quantity} photo(s) for a total of $${totalPrice}.`);
  };

  return (
   
    <div>
       <Header/>
    <div class="buy-photo">
      
    <h2>Buy Photo</h2>
    <div class="price-details">
      <p>Price: $10</p>
      
    </div>
    <div class="posted-by-details">
      <p>Posted By: </p>
      <p>Phone: </p>
      <p>Email: </p>
    </div>
    <button className='purchase-button'>Purchase</button>
  </div>
  </div>
  );
};

export default Purchase;
