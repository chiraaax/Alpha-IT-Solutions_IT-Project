const CartItem = ({ item, updateQuantity }) => {
    return (
      <div className="flex justify-between items-center border p-4 mb-2 shadow">
        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover"/>
        <div className="flex-1 px-4">
          <h3 className="font-bold">{item.name}</h3>
          <p>${item.price.toFixed(2)}</p>
        </div>
        <input 
          type="number" 
          min="1" 
          value={item.quantity} 
          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
          className="border p-2 w-16"
        />
        <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    );
  };
  
  export default CartItem;