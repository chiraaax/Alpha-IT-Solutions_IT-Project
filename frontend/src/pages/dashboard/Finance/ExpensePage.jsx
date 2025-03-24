import { useEffect, useState } from "react";

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ amount: "", category: "", date: "", description: "" });
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/expenses/all");
            const data = await res.json();
            setExpenses(data);
        } catch (error) {
            setError("Error fetching expenses");
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addExpense = async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:5000/api/expenses/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            setFormData({ amount: "", category: "", date: "", description: "" });
            fetchExpenses();
        } catch (error) {
            setError("Error adding expense");
            console.error(error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/expenses/${id}`, { method: "DELETE" });
            setExpenses(expenses.filter(expense => expense._id !== id));
        } catch (error) {
            setError("Error deleting expense");
            console.error(error);
        }
    };

    const handleEditClick = (expense) => {
        setEditingExpense(expense._id);
        setFormData({
            amount: expense.amount,
            category: expense.category,
            date: expense.date.split("T")[0],
            description: expense.description,
        });
    };

    const updateExpense = async (e) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:5000/api/expenses/${editingExpense}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            setEditingExpense(null);
            setFormData({ amount: "", category: "", date: "", description: "" });
            fetchExpenses();
        } catch (error) {
            setError("Error updating expense");
            console.error(error);
        }
    };

    return (
        <div style={styles.container}>
            <style>
                {`
                    input {
                        background: #333;
                        border: 1px solid #444;
                        color: #fff;
                        padding: 8px;
                        border-radius: 5px;
                        width: 100%;
                    }
                    input::placeholder {
                        color: white;
                    }
                    button {
                        padding: 10px;
                        background: #bb86fc;
                        color:rgb(87, 87, 87);
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-top: 10px;
                    }
                    button:hover {
                        background: #9c68e3;
                    }
                    .edit-btn {
                        background: #ff9800 !important;
                    }
                    .edit-btn:hover {
                        background: #e68900 !important;
                    }
                    .delete-btn {
                        background: #ff5555;
                    }
                    .delete-btn:hover {
                        background: #ff3333;
                    }
                `}
            </style>
            
            <h1>Expenses of <b>Alpha IT Solutions</b></h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={editingExpense ? updateExpense : addExpense} style={styles.form}>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
                <button type="submit">{editingExpense ? "Update Expense" : "Add Expense"}</button>
                {editingExpense && <button type="button" onClick={() => setEditingExpense(null)}>Cancel</button>}
            </form>

            <ul style={styles.list}>
                {expenses.map(expense => (
                    <li key={expense._id} style={styles.listItem}>
                        <span>{expense.category}: ${expense.amount} - {expense.date.split("T")[0]} - {expense.description}</span>
                        <div>
                            <button className="edit-btn" onClick={() => handleEditClick(expense)}>Edit</button>
                            <button className="delete-btn" onClick={() => deleteExpense(expense._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Internal Styles as JavaScript Object
const styles = {
    container: {
        maxWidth: "600px",
        margin: "20px auto",
        padding: "20px",
        background: "#1e1e1e",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        background: "#232323",
        padding: "15px",
        borderRadius: "8px",
    },
    list: {
        listStyleType: "none",
        padding: "0",
    },
    listItem: {
        background: "#2a2a2a",
        padding: "10px",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "8px 0",
        color: "white",
    },
};

export default ExpensePage;
