import { useNavigate } from "react-router-dom";
import axios from "axios";

const Summary = ({ cart }) => {
    const navigate = useNavigate(); // React Router navigation

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

    const handleCheckout = async () => {
        try {
            // if (!userId) {
            //     alert("Please log in first.");
            //     navigate("/login");
            //     return;
            // }

            if (!total || isNaN(total)) {
                alert("Invalid total amount!");
                return;
            }

            const orderData = {
                customerId: "67deced64f3bc4a00af20c0c",  // Assuming userId is stored in localStorage
                totalAmount: total,
                status: "Pending",  // Optional: Adjust according to your needs
                // orderId: "someOrderId", // Replace with an actual order ID generation if necessary
            };

            const response = await axios.post("http://localhost:5000/api/successorders/create", orderData);
            console.log("SuccessOrder saved:", response.data);

            navigate("/CheckoutForm"); // Ensure this route exists and navigate to the checkout form
        } catch (error) {
            console.error("Error saving order:", error.response ? error.response.data : error.message);
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
