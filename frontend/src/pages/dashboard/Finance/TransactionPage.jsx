import { useEffect, useState, useRef } from "react";

const TransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ amount: "", type: "Expense", category: "", date: "", description: "" });
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [selectedType, setSelectedType] = useState("All");
    const [reportData, setReportData] = useState([]);

    const reportRef = useRef();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/transactions/all");
            const data = await res.json();
            setTransactions(data);
        } catch (error) {
            setError("Error fetching transactions");
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addTransaction = async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:5000/api/transactions/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            setFormData({ amount: "", type: "Expense", category: "", date: "", description: "" });
            fetchTransactions();
        } catch (error) {
            setError("Error adding transaction");
            console.error(error);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/transactions/${id}`, { method: "DELETE" });
            setTransactions(transactions.filter(transaction => transaction._id !== id));
        } catch (error) {
            setError("Error deleting transaction");
            console.error(error);
        }
    };

    const handleEditClick = (transaction) => {
        setEditingTransaction(transaction._id);
        setFormData({
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            date: transaction.date.split("T")[0],
            description: transaction.description,
        });
    };

    const updateTransaction = async (e) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:5000/api/transactions/${editingTransaction}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            setEditingTransaction(null);
            setFormData({ amount: "", type: "Expense", category: "", date: "", description: "" });
            fetchTransactions();
        } catch (error) {
            setError("Error updating transaction");
            console.error(error);
        }
    };

    const generateReport = () => {
        let filtered = transactions;

        if (selectedCategory !== "All") {
            filtered = filtered.filter(txn => txn.category === selectedCategory);
        }
        if (selectedType !== "All") {
            filtered = filtered.filter(txn => txn.type === selectedType);
        }

        setReportData(filtered);
    };

    const handlePrint = () => {
        const printContents = reportRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    const getTotalAmount = () => {
        return reportData.reduce((sum, txn) => sum + Number(txn.amount), 0);
    };

    return (
        <div style={styles.container}>
            <style>{`
                body {
                    // background-color: #121212;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 20px;
                    color: #e0e0e0;
                }

                h1, h2, h3 {
                    color: #ffffff;
                }

                form input, form select {
                    padding: 10px;
                    margin: 8px 0;
                    border: 1px solid #333;
                    border-radius: 8px;
                    width: 100%;
                    box-sizing: border-box;
                    background-color: #1f1f1f;
                    color: #e0e0e0;
                }

                form button {
                    background-color: #007BFF;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }

                form button:hover {
                    background-color: #0056b3;
                }

                .report-section {
                    margin-top: 40px;
                    padding: 20px;
                    background-color: #1e1e1e;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                }

                .report-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }

                .report-table th, .report-table td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #333;
                }

                .report-table th {
                    background-color: #007BFF;
                    color: white;
                }

                .report-table tr:nth-child(even) {
                    background-color: #2a2a2a;
                }

                .edit-btn, .delete-btn {
                    margin-left: 10px;
                    padding: 6px 12px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .edit-btn {
                    background-color: #f39c12;
                    color: white;
                }

                .edit-btn:hover {
                    background-color: #d68910;
                }

                .delete-btn {
                    background-color: #e74c3c;
                    color: white;
                }

                .delete-btn:hover {
                    background-color: #c0392b;
                }
            `}</style>

            <h1>Transactions of <b>Alpha IT Solutions</b></h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={editingTransaction ? updateTransaction : addTransaction} style={styles.form}>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />

                <select name="type" value={formData.type} onChange={handleChange} required>
                    <option value="Income">Income</option>
                    <option value="Expense">Expense</option>
                </select>

                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button type="submit">{editingTransaction ? "Update Transaction" : "Add Transaction"}</button>
                    {editingTransaction && <button type="button" onClick={() => setEditingTransaction(null)}>Cancel</button>}
                </div>
            </form>

            {/* Report Section */}
            <div className="report-section" ref={reportRef}>
                <h2>Transaction Report</h2>

                <div style={{ marginBottom: "10px" }}>
                    <label>Filter by Category: </label>
                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ marginRight: "10px" }}>
                        <option value="All">All</option>
                        {Array.from(new Set(transactions.map(txn => txn.category))).map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>

                    <label>Filter by Type: </label>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                        <option value="All">All</option>
                        <option value="Income">Income</option>
                        <option value="Expense">Expense</option>
                    </select>
                </div>

                <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                    <button onClick={generateReport}>Generate Report</button>
                    <button onClick={handlePrint}>Print Report</button>
                </div>

                {reportData.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                        <h3>Category: {selectedCategory} | Type: {selectedType}</h3>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Amount (LKR)</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map(txn => (
                                    <tr key={txn._id}>
                                        <td>{txn.type}</td>
                                        <td>{txn.category}</td>
                                        <td>LKR {txn.amount}</td>
                                        <td>{txn.date.split("T")[0]}</td>
                                        <td>{txn.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h3 style={{ marginTop: "10px" }}>Total Amount: LKR {getTotalAmount()}</h3>
                    </div>
                )}
            </div>

            <ul style={styles.list}>
                {transactions.map(txn => (
                    <li key={txn._id} style={styles.listItem}>
                        <span>{txn.type} - {txn.category}: <br/>LKR {txn.amount} - {txn.date.split("T")[0]} - {txn.description}</span>
                        <div>
                            <button className="edit-btn" onClick={() => handleEditClick(txn)}>Edit</button>
                            <button className="delete-btn" onClick={() => deleteTransaction(txn._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "900px",
        margin: "20px auto",
        padding: "20px",
        background: "#1a1a1a",
        borderRadius: "12px",
        boxShadow: "0 6px 15px rgba(0, 0, 0, 0.7)",
        textAlign: "center",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        background: "#262626",
        padding: "20px",
        borderRadius: "10px",
    },
    list: {
        listStyleType: "none",
        padding: "0",
        marginTop: "30px",
    },
    listItem: {
        background: "#2a2a2a",
        padding: "12px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "8px 0",
        color: "white",
    },
};

export default TransactionPage;
