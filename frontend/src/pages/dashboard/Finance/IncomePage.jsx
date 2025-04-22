import { useEffect, useState, useRef } from "react";

const IncomePage = () => {
    const [incomes, setIncomes] = useState([]);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ amount: "", source: "", date: "", description: "" });
    const [editingIncome, setEditingIncome] = useState(null);
    const [selectedSource, setSelectedSource] = useState("All");
    const [reportData, setReportData] = useState([]);
    const reportRef = useRef();

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/income/all");
            const data = await res.json();
            setIncomes(data);
        } catch (error) {
            setError("Error fetching incomes");
            console.error(error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addIncome = async (e) => {
        e.preventDefault();
        try {
            await fetch("http://localhost:5000/api/income/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            setFormData({ amount: "", source: "", date: "", description: "" });
            fetchIncomes();
        } catch (error) {
            setError("Error adding income");
            console.error(error);
        }
    };

    const deleteIncome = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/income/${id}`, { method: "DELETE" });
            setIncomes(incomes.filter(income => income._id !== id));
        } catch (error) {
            setError("Error deleting income");
            console.error(error);
        }
    };

    const handleEditClick = (income) => {
        setEditingIncome(income._id);
        setFormData({
            amount: income.amount,
            source: income.source,
            date: income.date.split("T")[0],
            description: income.description,
        });
    };

    const updateIncome = async (e) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:5000/api/income/${editingIncome}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            setEditingIncome(null);
            setFormData({ amount: "", source: "", date: "", description: "" });
            fetchIncomes();
        } catch (error) {
            setError("Error updating income");
            console.error(error);
        }
    };

    const generateReport = () => {
        if (incomes.length === 0) {
            setReportData([]);  // If no incomes are available, clear the report data
            return;
        }
        const filteredData = selectedSource === "All"
            ? incomes
            : incomes.filter(income => income.source === selectedSource);
        setReportData(filteredData);
    };

    const printReport = () => {
        const content = reportRef.current.innerHTML;
        const printWindow = window.open("", "_blank", "width=600,height=400");

        printWindow.document.write("<html><head><title>Income Report</title>");
        printWindow.document.write("<style>"); // Add any necessary styles here
        printWindow.document.write(`
            body { font-family: Arial, sans-serif; padding: 20px; background: #fff; color: #000; }
            h1 { text-align: center; }
            .report-table { width: 100%; border-collapse: collapse; }
            .report-table th, .report-table td { padding: 8px; border: 1px solid #ccc; text-align: left; }
        `);
        printWindow.document.write("</style></head><body>");
        printWindow.document.write(content);
        printWindow.document.write("</body></html>");
        
        printWindow.document.close(); // Close the document to apply styles
        printWindow.print(); // Trigger print
        printWindow.onafterprint = () => printWindow.close(); // Close the window after printing
    };

    const getTotalIncome = () => {
        return reportData.reduce((sum, inc) => sum + inc.amount, 0);
    };

    return (
        <div style={styles.container}>
            <style>
                {`
                    input, select {
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
                    .report-section {
                        background: #1e1e1e;
                        padding: 10px;
                        border-radius: 8px;
                        margin-top: 20px;
                        color: white;
                    }
                    .report-table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .report-table th, .report-table td {
                        padding: 10px;
                        border: 1px solid #444;
                        text-align: left;
                    }
                `}
            </style>
            <h1>Income of <b>Alpha IT Solutions</b></h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Income Form */}
            <form onSubmit={editingIncome ? updateIncome : addIncome} style={styles.form}>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required />
                <input type="text" name="source" value={formData.source} onChange={handleChange} placeholder="Source (e.g., Product Sale, Service)" required />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
                <button type="submit">{editingIncome ? "Update Income" : "Add Income"}</button>
                {editingIncome && <button type="button" onClick={() => setEditingIncome(null)}>Cancel</button>}
            </form>

            {/* Report Section */}
            <div className="report-section" ref={reportRef}>
                <h2>Income Report</h2>
                <label>Filter by Source: </label>
                <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}>
                    <option value="All">All</option>
                    {Array.from(new Set(incomes.map(inc => inc.source))).map(source => (
                        <option key={source} value={source}>{source}</option>
                    ))}
                </select>
                <button onClick={generateReport}>Generate Report</button>
                <button onClick={printReport}>Print Report</button>

                {reportData.length > 0 && (
                    <div>
                        <h3>Source: {selectedSource}</h3>
                        <h3>Total Income: ${getTotalIncome()}</h3>
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Source</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData.map(income => (
                                    <tr key={income._id}>
                                        <td>{income.source}</td>
                                        <td>${income.amount}</td>
                                        <td>{income.date.split("T")[0]}</td>
                                        <td>{income.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ul style={styles.list}>
                {incomes.map(income => (
                    <li key={income._id} style={styles.listItem}>
                        <span>{income.source}: ${income.amount} - {income.date.split("T")[0]} - {income.description}</span>
                        <div>
                            <button className="edit-btn" onClick={() => handleEditClick(income)}>Edit</button>
                            <button className="delete-btn" onClick={() => deleteIncome(income._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

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

export default IncomePage;
