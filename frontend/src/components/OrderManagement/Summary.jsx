import { useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios for API requests
import CheckoutForm from "./CheckoutForm"

const Summary = ({ cart }) => {
    const navigate = useNavigate(); // React Router navigation

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

    const handleCheckout = async () => {
        try {
            // Prepare the data you want to send
            const orderData = {
                totalAmount: total,
                // Add other fields if necessary, such as userId, orderId, etc.
            };

            // Make a POST request to save the total amount to your database
            const response = await axios.post("api/successorders/create", orderData);
            console.log("SuccessOrder saved:", response.data);
            
            // After saving, navigate to the checkout form
            navigate("/CheckoutForm"); // Ensure this matches your route definition
        } catch (error) {
            console.error("Error saving order:", error);
        }
    };

    return (
        <div className="border p-4 shadow">
            <h3 className="text-xl font-bold mb-4">Summary</h3>
            <h3 className="text-lg font-bold mb-2">Estimate Shipping and Tax</h3>
            <p className="text-sm text-gray-600 mb-4">Enter your destination to get a shipping estimate.</p>
            <p>Subtotal: {formatCurrency(subtotal)}</p>
            <p>Tax (5%): {formatCurrency(tax)}</p>
            <p className="font-bold text-lg mt-2">Total: {formatCurrency(total)}</p>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4 w-full"
                onClick={handleCheckout}
            >
                Proceed to Checkout
            </button>
        </div>
    );
};

export default Summary;
