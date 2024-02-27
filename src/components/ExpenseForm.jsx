import React, { useState } from "react";
import Input from "./Input";
import Select from "./Select";

export default function ExpenseForm({
  expense,
  setExpense,
  setExpenses,
  editingRowId,
  setEditingRowId,
}) {
  const [errors, setErrors] = useState({});

  const validationConfig = {
    title: [
      { required: true, message: "Please Enter a Title" },
      { minLength: 5, message: "Title should be atleast 5 characters long " },
    ],

    category: [{ required: true, message: "Please Select a category" }],

    amount: [
      { required: true, message: "Please Enter an Amount" },
      {
        pattern: /^(0|[1-9]\d*)(\.\d+)?$/,
        message: "Please enter a valid number",
      },
    ],
  };

  const validate = (formData) => {
    const errorsData = {};

    Object.entries(formData).forEach(([key, value]) => {
      validationConfig[key].some((rule) => {
        if (rule.required && !value) {
          errorsData[key] = rule.message;
          return true;
        }
        if (rule.minLength && value.length < 5) {
          errorsData[key] = rule.message;
          return true;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errorsData[key] = rule.message;
          return true;
        }
      });
    });

    setErrors(errorsData);
    return errorsData;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validateResult = validate(expense);
    if (Object.keys(validateResult).length) return;

    if (editingRowId) {
      setExpenses((prevState) =>
        prevState.map((prevExpense) => {
          if (prevExpense.id === editingRowId) {
            return { ...expense, id: editingRowId };
          }
          return prevExpense;
        })
      );
      setExpense({
        title: "",
        category: "",
        amount: "",
      });
      setEditingRowId("");
      return;
    }

    setExpenses((prevState) => [
      ...prevState,
      { ...expense, id: crypto.randomUUID() },
    ]);
    setExpense({
      title: "",
      category: "",
      amount: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors({});
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <Input
        label="Title"
        id="title"
        name="title"
        value={expense.title}
        onChange={handleChange}
        error={errors.title}
      />

      <Select
        label="Category"
        id="category"
        name="category"
        value={expense.category}
        onChange={handleChange}
        defaultOption="Select Category"
        options={["Grocery", "Clothes", "Bills", "Education", "Medicine"]}
        error={errors.category}
      />

      <Input
        label="Amount"
        id="amount"
        name="amount"
        value={expense.amount}
        onChange={handleChange}
        error={errors.amount}
      />
      <button className="add-btn">{editingRowId ? "Save" : "Add"}</button>
    </form>
  );
}
