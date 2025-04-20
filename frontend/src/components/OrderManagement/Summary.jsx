import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addOrder } from "../../redux/features/cart/cartSlice";
import axios from "axios";

const Summary = ({ cart }) => {
    const customerId = localStorage.getItem("userId"); // or from Redux/auth state
    const navigate = useNavigate(); // React Router navigation
    const dispatch = useDispatch();

    // const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => {
        const price = item.discountPrice ?? item.price;
        return sum + price * item.quantity;
    }, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    const formatCurrency = (amount) =>
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

    const handleCheckout = async () => {
        try {
            if (!total || isNaN(total)) {
                alert("Invalid total amount!");
                return;
            }

            // const orderData = {
            //     customerId: "67deced64f3bc4a00af20c0c",  // Assuming userId is stored in localStorage
            //     totalAmount: total,
            //     status: "Pending",
            // };
            // Prepare the item array with itemId, itemType, and quantity
            const items = cart.map(item => ({
                itemId: item._id, // assuming _id is the item ID
                itemType: item.prebuildId ? "prebuild" : "product", // or however you're detecting type
                quantity: item.quantity
            }));
    
            const orderData = {
                customerId: customerId || "67deced64f3bc4a00af20c0c", // fallback if needed
                totalAmount: total,
                status: "Pending",
                items: items
            };

            const response = await axios.post("http://localhost:5000/api/successorders/create", orderData);
            console.log("SuccessOrder saved:", response.data);

            dispatch(addOrder());
            // console.log("item with ID:", item._id);
            navigate("/CheckoutForm"); // Ensure this route exists and navigate to the checkout form
        } catch (error) {
            console.error("Error saving order:", error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6">Order Summary</h3>
            <h3 className="text-lg font-semibold text-blue-400 mb-4">Estimate Shipping and Tax</h3>
            <p className="text-sm text-gray-400 mb-6">Enter your destination to get a shipping estimate.</p>

            <div className="space-y-2">
                <p className="text-gray-300">Subtotal: {formatCurrency(subtotal)}</p>
                <p className="text-gray-300">Tax (5%): {formatCurrency(tax)}</p>
                <p className="font-bold text-lg text-white">Total: {formatCurrency(total)}</p>
            </div>

            <button
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 mt-6 w-full"
                onClick={handleCheckout}
            >
                Proceed to Checkout
            </button>
        </div>
    );
};

export default Summary;
