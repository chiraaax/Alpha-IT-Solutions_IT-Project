export const deleteOrder = async (email) => {
    try {
        console.log("Sending DELETE request for email:", email); // Debugging

        const res = await fetch(`http://localhost:5000/api/orders/orders/${encodeURIComponent(email)}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            const errorText = await res.text(); // Read response even if it's not JSON
            console.error("Server response:", errorText);
            throw new Error(`Failed to delete order: ${res.statusText}`);
        }

        const result = await res.json();
        return result;
    } catch (error) {
        console.error("Error deleting order:", error);
        return { message: "Error deleting order" };
    }
};

export const updateOrder = async (email, updatedData) => {
    if (!email) {
        console.error("Email is missing in updateOrder function");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/orders/orders/${encodeURIComponent(email)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error("Failed to update order");
        return await response.json();
    } catch (error) {
        console.error("Error updating order:", error);
    }
};