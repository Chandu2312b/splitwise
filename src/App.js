// File: App.jsx
import React, { useState, useEffect } from "react";
import './App.css';

export default function App() {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState(["Food"]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const initialName = prompt("Enter name for first user:") || "User 1";
    setUsers([initialName]);
    setExpenses([[0]]);
  }, []);

  const addUser = () => {
    const newName = prompt("Enter new user name:");
    if (newName) {
      setUsers([...users, newName]);
      setExpenses([...expenses, Array(categories.length).fill(0)]);
    }
  };

  const addCategory = () => {
    const newCategory = prompt("Enter new category name:");
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setExpenses(expenses.map(row => [...row, 0]));
    }
  };

  const handleChange = (i, j, value) => {
    const updated = expenses.map(row => [...row]);
    updated[i][j] = value === "" ? "" : parseFloat(value) || 0;
    setExpenses(updated);
  };

  const calculateTransactions = () => {
    const totalPerUser = expenses.map(row => row.reduce((a, b) => a + parseFloat(b || 0), 0));
    const totalSpent = totalPerUser.reduce((a, b) => a + b, 0);
    const average = totalSpent / users.length;
    const balances = totalPerUser.map(total => +(total - average).toFixed(2));

    const transactions = [];
    let debtors = [], creditors = [];

    balances.forEach((bal, i) => {
      if (bal < 0) debtors.push({ name: users[i], amount: -bal });
      else if (bal > 0) creditors.push({ name: users[i], amount: bal });
    });

    while (debtors.length && creditors.length) {
      let debtor = debtors[0];
      let creditor = creditors[0];
      const settledAmount = Math.min(debtor.amount, creditor.amount);

      transactions.push(`${debtor.name} owes ₹${settledAmount.toFixed(2)} to ${creditor.name}`);

      debtor.amount -= settledAmount;
      creditor.amount -= settledAmount;

      if (debtor.amount === 0) debtors.shift();
      if (creditor.amount === 0) creditors.shift();
    }

    return transactions;
  };

  return (
    <div className="container">
      <h1>💸 Splitwise Clone</h1>

      <table className="table">
        <thead>
          <tr>
            <th>User \ Category</th>
            {categories.map((cat, idx) => (
              <th key={idx}>{cat}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={i}>
              <td className="font-weight-bold">{user}</td>
              {categories.map((_, j) => (
                <td key={j}>
                  <input
                    type="number"
                    value={expenses[i][j] === 0 ? "" : expenses[i][j]}
                    onChange={(e) => handleChange(i, j, e.target.value)}
                    placeholder="0"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="buttons">
        <button onClick={addUser}>Add User</button>
        <button onClick={addCategory}>Add Category</button>
      </div>

      <h2>Result:</h2>
      <ul className="results results-list">
        {calculateTransactions().map((line, i) => (
          <li key={i}>
            <span className="payer">{line.split(' owes ')[0]}</span> owes ₹{line.split('₹')[1].split(' to ')[0]} to <span className="receiver">{line.split(' to ')[1]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}