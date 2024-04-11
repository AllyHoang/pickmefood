import React, { useState } from 'react';

const RequestsForm = () => {
  const [request, setRequest] = useState({
    name: '',
    category: 'Food', // Default category set to 'Food'
    details: '',
  });

  const handleChange = (e) => {
    setRequest({ ...request, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you will handle the form submission.
    // This might involve sending data to a backend server.
    console.log(request);
  };

  return (
    <div>
      <h1>Create Your Request</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={request.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={request.category}
            onChange={handleChange}
            required
          >
            <option value="Food">Food</option>
            <option value="Items">Items</option>
          </select>
        </div>
        <div>
          <label htmlFor="details">Details:</label>
          <textarea
            id="details"
            name="details"
            value={request.details}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestsForm;
