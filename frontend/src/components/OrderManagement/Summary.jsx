const Summary = ({ cart }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
  
    return (
      <div className="border p-4 shadow">
        <h3 className="text-xl font-bold mb-4">Summary</h3>
        <h3 className="text-x2 font-bold mb-4">Estimate Shipping and Tax</h3>
        <h3 className="text-x3 font-normal mb-4">Enter your destination to get a shipping estimate.</h3>
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Tax (5%): ${tax.toFixed(2)}</p>
        <p className="font-bold text-lg mt-2">Total: ${total.toFixed(2)}</p>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 w-full">Proceed to Checkout</button>
      </div>
    );
  };
  
  export default Summary;
  