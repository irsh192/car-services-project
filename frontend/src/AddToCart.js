// This file contains the reusable Add to Cart button component.
function AddToCartButton({ productId, quantity }) {
    const handleAddToCart = async () => {
      const response = await fetch('http://localhost:5001/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
  
      if (response.ok) {
        console.log('Product added to cart');
      } else {
        console.error('Failed to add product to cart');
      }
    };
  
    return (
      <button onClick={handleAddToCart}>Add to Cart</button>
    );
  }
  
  export default AddToCartButton;
  