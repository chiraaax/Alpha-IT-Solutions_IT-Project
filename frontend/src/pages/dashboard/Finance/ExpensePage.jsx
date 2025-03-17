import { useEffect, useState } from "react";

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Fetch all expenses
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
            console.error("Error fetching expenses:", error);
        }
    };

    // Add Expense (Create)
    const addExpense = async () => {
        try {
            const newExpense = { category: "Utilities", amount: 50, date: "2025-03-17" };
            const res = await fetch("http://localhost:5000/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newExpense),
            });

            const result = await res.json();
            console.log(result.message);
            fetchExpenses(); // Refresh list
        } catch (error) {
            setError("Error adding expense");
            console.error("Error adding expense:", error);
        }
    };

    // Delete Expense
    const deleteExpense = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/expenses${id}`, { method: "DELETE" });
            setExpenses(expenses.filter(expense => expense._id !== id)); // Remove from UI
        } catch (error) {
            setError("Error deleting expense");
            console.error("Error deleting expense:", error);
        }
    };

    // Update Expense
    const updateExpense = async (id) => {
        try {
            const updatedData = { amount: 120, category: "Office Supplies" };
            await fetch(`http://localhost:5000/api/expenses${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            fetchExpenses(); // Refresh list
        } catch (error) {
            setError("Error updating expense");
            console.error("Error updating expense:", error);
        }
    };

    return (
        <div>
            <h1>Expenses of <b>Alpha IT Solutions</b></h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button onClick={addExpense}>Add Expense</button>
            <ul>
                {expenses.map(expense => (
                    <li key={expense._id}>
                        {expense.category}: ${expense.amount} - {expense.date}
                        <button onClick={() => updateExpense(expense._id)}>Update</button>
                        <button onClick={() => deleteExpense(expense._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpensePage;



// import { useEffect, useState } from "react";
// // import Expense from "../../../../backend/models/Finance/Expense";

// const Dashboard = () => {
//     const [data, setData] = useState({ income: 0, expenses: 0 });

//     useEffect(() => {
//         const fetchFinanceData = async () => {
//             const incomeRes = await fetch('/api/income/all');
//             const expenseRes = await fetch('/api/expenses/all');
//             const incomes = await incomeRes.json();
//             const expenses = await expenseRes.json();

//             setData({
//                 income: incomes.reduce((acc, inc) => acc + inc.amount, 0),
//                 expenses: expenses.reduce((acc, exp) => acc + exp.amount, 0)
//             });
//         };

//         fetchFinanceData();
//     }, []);

//     return (
//         <div>
//             <h2>Finance Dashboard</h2>
//             <p>Income: ${data.income}</p>
//             <p>Expenses: ${data.expenses}</p>
//             <p>Profit: ${data.income - data.expenses}</p>
//         </div>
//     );
// };

// export default Dashboard;
