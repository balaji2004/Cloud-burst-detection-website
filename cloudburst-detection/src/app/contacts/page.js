// src/app/contacts/page.js
'use client';

import { useState, useEffect } from 'react';
import { database, ref, onValue, set, remove, get } from '@/lib/firebase';
import { formatPhoneNumber, isValidPhoneNumber, generateId } from '@/lib/utils';
import { UserPlus, Trash2, Mail, Phone, Bell } from 'lucide-react';

export default function Contacts() {
  const [contacts, setContacts] = useState({});
  const [nodes, setNodes] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    associatedNodes: [],
    notificationPreference: 'sms',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load contacts
    const contactsRef = ref(database, 'contacts');
    const unsubscribeContacts = onValue(contactsRef, (snapshot) => {
      setContacts(snapshot.val() || {});
    });

    // Load nodes for selection
    const nodesRef = ref(database, 'nodes');
    const unsubscribeNodes = onValue(nodesRef, (snapshot) => {
      setNodes(snapshot.val() || {});
    });

    return () => {
      unsubscribeContacts();
      unsubscribeNodes();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNodeSelection = (nodeId) => {
    setFormData(prev => ({
      ...prev,
      associatedNodes: prev.associatedNodes.includes(nodeId)
        ? prev.associatedNodes.filter(id => id !== nodeId)
        : [...prev.associatedNodes, nodeId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate phone
      if (!isValidPhoneNumber(formData.phone)) {
        throw new Error('Invalid phone number. Enter 10-digit Indian number.');
      }

      const contactId = generateId('contact');
      const formattedPhone = formatPhoneNumber(formData.phone);

      const contactData = {
        id: contactId,
        name: formData.name,
        phone: formattedPhone,
        email: formData.email || '',
        associatedNodes: formData.associatedNodes,
        notificationPreference: formData.notificationPreference,
        createdAt: Date.now(),
        lastUpdated: Date.now(),
      };

      await set(ref(database, `contacts/${contactId}`), contactData);

      setMessage({ type: 'success', text: 'Contact added successfully!' });
      setFormData({
        name: '',
        phone: '',
        email: '',
        associatedNodes: [],
        notificationPreference: 'sms',
      });
      setShowForm(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contactId) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      await remove(ref(database, `contacts/${contactId}`));
      setMessage({ type: 'success', text: 'Contact deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete contact' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Management</h1>
            <p className="text-gray-600 mt-1">
              Manage contacts for SMS/email alerts
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            Add Contact
          </button>
        </div>

        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Add Contact Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Contact</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="9876543210"
                  />
                  <p className="text-xs text-gray-500 mt-1">10-digit Indian number</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Preference
                  </label>
                  <select
                    name="notificationPreference"
                    value={formData.notificationPreference}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="sms">SMS Only</option>
                    <option value="email">Email Only</option>
                    <option value="both">Both SMS & Email</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Associated Nodes *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Object.keys(nodes).map(nodeId => (
                    <label key={nodeId} className="flex items-center gap-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.associatedNodes.includes(nodeId)}
                        onChange={() => handleNodeSelection(nodeId)}
                        className="rounded"
                      />
                      <span className="text-sm">{nodes[nodeId]?.metadata?.name || nodeId}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select nodes to receive alerts from
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contact List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Associated Nodes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferences
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(contacts).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No contacts added yet. Click "Add Contact" to get started.
                  </td>
                </tr>
              ) : (
                Object.entries(contacts).map(([id, contact]) => (
                  <tr key={id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {contact.phone}
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-gray-400" />
                            {contact.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {contact.associatedNodes?.map(nodeId => (
                          <span key={nodeId} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {nodes[nodeId]?.metadata?.name || nodeId}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900 capitalize">
                          {contact.notificationPreference}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}