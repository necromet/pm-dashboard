import React, { useState } from 'react';
import { clients, contentTypes } from '../../data/mockData';

const priorities = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

export default function BriefForm({ onSubmit }) {
  const [form, setForm] = useState({
    clientId: '',
    contentType: '',
    title: '',
    context: '',
    copy: '',
    visualDirection: '',
    priority: 'medium',
    dueDate: '',
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.clientId) newErrors.clientId = 'Client is required';
    if (!form.contentType) newErrors.contentType = 'Content type is required';
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.context.trim()) newErrors.context = 'Context is required';
    if (!form.copy.trim()) newErrors.copy = 'Copy is required';
    if (!form.visualDirection.trim()) newErrors.visualDirection = 'Visual direction is required';
    if (!form.dueDate) newErrors.dueDate = 'Due date is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
    if (onSubmit) onSubmit(form);
    setTimeout(() => {
      setForm({
        clientId: '',
        contentType: '',
        title: '',
        context: '',
        copy: '',
        visualDirection: '',
        priority: 'medium',
        dueDate: '',
      });
      setSubmitted(false);
    }, 2000);
  };

  const inputClass = (field) =>
    `w-full border rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-5">
      <h3 className="text-lg font-semibold text-gray-900">Submit New Brief</h3>

      {submitted && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          Brief submitted successfully!
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
          <select
            value={form.clientId}
            onChange={(e) => handleChange('clientId', e.target.value)}
            className={inputClass('clientId')}
          >
            <option value="">Select client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.logo} {c.name}
              </option>
            ))}
          </select>
          {errors.clientId && <p className="text-red-500 text-xs mt-1">{errors.clientId}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
          <select
            value={form.contentType}
            onChange={(e) => handleChange('contentType', e.target.value)}
            className={inputClass('contentType')}
          >
            <option value="">Select type...</option>
            {contentTypes.map((ct) => (
              <option key={ct.id} value={ct.id}>
                {ct.icon} {ct.label}
              </option>
            ))}
          </select>
          {errors.contentType && <p className="text-red-500 text-xs mt-1">{errors.contentType}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g. Summer Sale Campaign"
          className={inputClass('title')}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Context *</label>
        <textarea
          value={form.context}
          onChange={(e) => handleChange('context', e.target.value)}
          placeholder="Describe the campaign goal, target audience, and key messages..."
          rows={3}
          className={inputClass('context')}
        />
        {errors.context && <p className="text-red-500 text-xs mt-1">{errors.context}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Copy *</label>
        <textarea
          value={form.copy}
          onChange={(e) => handleChange('copy', e.target.value)}
          placeholder="Write the caption, hashtags, and call-to-action..."
          rows={3}
          className={inputClass('copy')}
        />
        {errors.copy && <p className="text-red-500 text-xs mt-1">{errors.copy}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Visual Direction *</label>
        <textarea
          value={form.visualDirection}
          onChange={(e) => handleChange('visualDirection', e.target.value)}
          placeholder="Describe the visual style, colors, layout, and references..."
          rows={3}
          className={inputClass('visualDirection')}
        />
        {errors.visualDirection && <p className="text-red-500 text-xs mt-1">{errors.visualDirection}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <div className="flex gap-2">
            {priorities.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleChange('priority', p.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  form.priority === p.id
                    ? p.id === 'high'
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : p.id === 'medium'
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                      : 'bg-green-100 border-green-300 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            className={inputClass('dueDate')}
          />
          {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit Brief
      </button>
    </form>
  );
}
