import React, { useState } from 'react';

function FormExample() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="flex justify-content-center p-4">
      <div className="card p-4 w-full max-w-md shadow-2 border-round">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-900">Contact Form</h2>
        
        <form className="flex flex-column gap-3" onSubmit={handleSubmit}>
          <div className="field">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Full Name *
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border-round border-1 border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="field">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email Address *
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border-round border-1 border-gray-300 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="field">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Category
            </label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border-round border-1 border-gray-300 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select a category</option>
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="field">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Message *
            </label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border-round border-1 border-gray-300 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Enter your message here..."
              required
            ></textarea>
          </div>

          <div className="flex gap-2 mt-2">
            <button 
              type="submit" 
              className="flex-1 p-3 bg-blue-500 text-white border-round border-none cursor-pointer hover:bg-blue-600 transition-colors font-medium"
            >
              Submit
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({ name: '', email: '', message: '', category: '' })}
              className="flex-1 p-3 bg-gray-300 text-gray-700 border-round border-none cursor-pointer hover:bg-gray-400 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border-round">
          <h3 className="text-sm font-semibold mb-2 text-blue-900">Form Preview:</h3>
          <div className="text-xs text-gray-600">
            <p><strong>Name:</strong> {formData.name || 'Not entered'}</p>
            <p><strong>Email:</strong> {formData.email || 'Not entered'}</p>
            <p><strong>Category:</strong> {formData.category || 'Not selected'}</p>
            <p><strong>Message:</strong> {formData.message || 'Not entered'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormExample; 