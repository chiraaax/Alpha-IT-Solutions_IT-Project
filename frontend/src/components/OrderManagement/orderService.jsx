export const deleteOrder = async (id) => {
    try {
        const res = await fetch(`http://localhost:5000/api/orders/orders/${id}`, {
            method: "DELETE",
        });

        const result = await res.json();
        return result;
    } catch (error) {
        console.error("Error deleting order:", error);
        return { message: "Error deleting order" };
    }
};

export const updateOrder = async (id, updatedData) => {
    if (!id) {
        console.error("Order ID is missing in updateOrder function");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/orders/orders/${id}`, {
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


  