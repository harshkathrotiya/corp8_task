import React, { useState, useEffect } from 'react';

const TodoForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        due_date: initialData.due_date ? initialData.due_date.split('T')[0] : '',
        priority: initialData.priority || 'medium'
      });
    }
  }, [initialData]);

  // Keyboard shortcuts for form
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Enter - Submit form
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        document.querySelector('.submit-btn')?.click();
      }

      // Escape - Cancel form
      if (e.key === 'Escape' && onCancel) {
        e.preventDefault();
        onCancel();
      }
    };

    // Add event listener to form element
    const formElement = document.querySelector('.todo-form');
    if (formElement) {
      formElement.addEventListener('keydown', handleKeyDown);
      return () => {
        formElement.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [onCancel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      due_date: value
    }));

    // Clear error when user selects a date
    if (errors.due_date) {
      setErrors(prev => ({
        ...prev,
        due_date: ''
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    // Validate due date (now required)
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Format due_date to ISO string if provided
    const submitData = {
      ...formData,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
    };

    onSubmit(submitData);
  };

  // Get minimum date for date picker (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-5 rounded-lg border border-[#e9d8fd] mb-4 sm:mb-5 box-border">
      <div className="mb-3 sm:mb-4">
        <label htmlFor="title" className="block mb-1.5 font-medium text-black text-sm">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full p-2 border rounded-md font-sans text-sm bg-white text-black box-border transition-all duration-200 ${errors.title ? 'border-[#f43f5e] focus:shadow-[0_0_0_3px_rgba(244,63,94,0.15)]' : 'border-[#e9d8fd] focus:shadow-[0_0_0_3px_rgba(158,74,255,0.15)]'} focus:outline-none`}
          placeholder="Enter todo title"
        />
        {errors.title && <span className="text-[#f43f5e] text-sm mt-1.5 block">{errors.title}</span>}
      </div>

      <div className="mb-3 sm:mb-4">
        <label htmlFor="description" className="block mb-1.5 font-medium text-black text-sm">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full p-2 border border-[#e9d8fd] rounded-md font-sans text-sm bg-white text-black box-border transition-all duration-200 focus:outline-none focus:border-[#9e4aff] focus:shadow-[0_0_0_3px_rgba(158,74,255,0.15)]"
          placeholder="Enter todo description"
        />
      </div>

      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex-1 mb-3 sm:mb-4">
          <label htmlFor="due_date" className="block mb-1.5 font-medium text-black text-sm">Due Date *</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleDateChange}
            min={getMinDate()}
            required
            className={`w-full p-2 border rounded-md font-sans text-sm bg-white text-black box-border transition-all duration-200 ${errors.due_date ? 'border-[#f43f5e] focus:shadow-[0_0_0_3px_rgba(244,63,94,0.15)]' : 'border-[#e9d8fd] focus:shadow-[0_0_0_3px_rgba(158,74,255,0.15)]'} focus:outline-none appearance-auto`}
          />
          {errors.due_date && <span className="text-[#f43f5e] text-sm mt-1.5 block">{errors.due_date}</span>}
        </div>

        <div className="flex-1 mb-3 sm:mb-4">
          <label htmlFor="priority" className="block mb-1.5 font-medium text-black text-sm">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-2 border border-[#e9d8fd] rounded-md font-sans text-sm bg-white text-black box-border transition-all duration-200 focus:outline-none focus:border-[#9e4aff] focus:shadow-[0_0_0_3px_rgba(158,74,255,0.15)]"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2.5 mt-4 sm:mt-5">
        <button type="submit" className="bg-[#9e4aff] text-white border-none py-2 px-4 rounded-md font-medium cursor-pointer transition-all duration-200 hover:bg-[#8a36e6] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(158,74,255,0.15)] text-sm btn-medium">
          {initialData ? 'Update Todo' : 'Add Todo'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="bg-[#b27bff] text-white border-none py-2 px-4 rounded-md font-medium cursor-pointer transition-all duration-200 hover:bg-[#c4b5fd] hover:-translate-y-0.5 hover:shadow-[0_4px_6px_rgba(158,74,255,0.15)] text-sm btn-medium">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;