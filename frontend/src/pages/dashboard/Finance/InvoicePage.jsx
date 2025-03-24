import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ name: '', price: 0, quantity: 1 }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [status, setStatus] = useState('Pending');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch invoices on load
  useEffect(() => {
    axios.get('/api/invoices')
      .then(response => setInvoices(response.data))
      .catch(err => console.error('Error fetching invoices', err));
  }, []);

  // Fetch invoice details when editing
  useEffect(() => {
    if (selectedInvoice) {
      axios.get(`/api/invoices/${selectedInvoice}`)
        .then(response => {
          const invoice = response.data;
          setCustomerName(invoice.customerName);
          setItems(invoice.items);
          setTotalAmount(invoice.totalAmount);
          setStatus(invoice.status);
          setDate(invoice.date.split('T')[0]);
        })
        .catch(err => console.error('Error fetching invoice', err));
    }
  }, [selectedInvoice]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    updateTotalAmount(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', price: 0, quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
    updateTotalAmount(newItems);
  };

  const updateTotalAmount = (itemsList) => {
    const total = itemsList.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const invoiceData = { customerName, items, totalAmount, status, date };
    if (selectedInvoice) {
      axios.put(`/api/invoice/invoices/${selectedInvoice}`, invoiceData)
        .then(response => {
          setInvoices(invoices.map(invoice => invoice._id === response.data._id ? response.data : invoice));
          setSelectedInvoice(null);
        })
        .catch(err => console.error('Error updating invoice', err));
    } else {
      axios.post('/api/invoice/invoices', invoiceData)
        .then(response => {
          setInvoices([...invoices, response.data]);
        })
        .catch(err => console.error('Error creating invoice', err));
    }
  };

  const handleDeleteInvoice = (invoiceId) => {
    axios.delete(`/api/invoice/invoices/${invoiceId}`)
      .then(() => setInvoices(invoices.filter(invoice => invoice._id !== invoiceId)))
      .catch(err => console.error('Error deleting invoice', err));
  };

  return (
    <div className="invoice-management-container">
      <div className="invoice-list">
        <h2>Invoices</h2>
        {Array.isArray(invoices) && invoices.length > 0 ? (
          invoices.map(invoice => (
            <div key={invoice._id} className="invoice-item">
              <h3>{invoice.customerName}</h3>
              <p>Total: ${invoice.totalAmount}</p>
              <p>Status: {invoice.status}</p>
              <button onClick={() => setSelectedInvoice(invoice._id)}>Edit</button>
              <button onClick={() => handleDeleteInvoice(invoice._id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No invoices available</p>
        )}
      </div>

      <div className="invoice-form">
        <h2>{selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          {items.map((item, index) => (
            <div key={index} className="form-group">
              <label>Item {index + 1}</label>
              <input
                type="text"
                placeholder="Item Name"
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Price"
                name="price"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                required
              />
              <button type="button" onClick={() => handleRemoveItem(index)}>Remove Item</button>
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>Add Item</button>

          <div className="form-group">
            <label>Total Amount: ${totalAmount}</label>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button type="submit">{selectedInvoice ? 'Update' : 'Create'} Invoice</button>
        </form>
      </div>

      <style>{`
        .invoice-management-container {
          display: flex;
          justify-content: space-between;
          background-color: #f4f4f4;
          color: #333;
          padding: 20px;
          height: 100vh;
        }

        .invoice-list {
          width: 40%;
          overflow-y: auto;
        }

        .invoice-item {
          background-color: #e2e2e2;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .invoice-item h3 {
          margin: 0;
        }

        .invoice-form {
          width: 55%;
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          font-size: 16px;
        }

        input, select {
          width: 100%;
          padding: 10px;
          margin-top: 5px;
          background-color: #f2f2f2;
          color: #333;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        button {
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background-color: #45a049;
        }

        button[type="button"] {
          background-color: #f44336;
        }

        button[type="button"]:hover {
          background-color: #e53935;
        }

        h2 {
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default InvoicePage;
