"use client";

import { useEffect, useState } from 'react';
import { UserForm, UserTable, UserFilters, Modal } from '../components';
import { apiService } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  type: 'admin' | 'user' | 'agent';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [token]);

  const loadUsers = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const apiUsers = await apiService.listUsers(token);
      // Map API users to UI shape
      const mapped: User[] = apiUsers.map((u: any) => ({
        id: u.id,
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email,
        phone: u.phone || '',
        type: u.type?.toLowerCase() || 'user',
        isActive: u.isActive ?? true,
        createdAt: u.createdAt || new Date().toISOString(),
        updatedAt: u.updatedAt || new Date().toISOString(),
      }));
      setUsers(mapped);
      setError(null);
    } catch (e) {
      console.error('Failed to load users', e);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.type === filterRole;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' ? user.isActive : !user.isActive);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await apiService.deleteUser(id, token);
      setUsers(users.filter((u) => u.id !== id));
      setError(null);
    } catch (e: any) {
      console.error('Delete failed', e);
      
      // Handle specific error cases
      if (e?.statusCode === 404) {
        // User not found - remove from local state and show message
        setUsers(users.filter((u) => u.id !== id));
        setError('User was already deleted or not found. The list has been updated.');
        
        // Clear the error after 5 seconds
        setTimeout(() => setError(null), 5000);
      } else {
        // Other errors
        const errorMessage = e?.message || 'Failed to delete user. Please try again.';
        setError(errorMessage);
      }
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSave = async (userData: Partial<User>) => {
    if (!token) return;
    
    try {
      if (selectedUser) {
        // Update existing user
        const updatedUser = await apiService.updateUser(selectedUser.id, userData, token);
        setUsers(users.map((u) => (u.id === selectedUser.id ? {
          ...updatedUser,
          id: updatedUser.id,
          createdAt: updatedUser.createdAt || selectedUser.createdAt,
          updatedAt: updatedUser.updatedAt || new Date().toISOString(),
        } : u)));
      } else {
        // Create new user - exclude isActive as it's not expected by CreateUserDto
        const { isActive, ...createUserData } = userData;
        const createdUser = await apiService.createUser(createUserData, token);
        const newUser: User = {
          id: createdUser.id,
          firstName: createdUser.firstName,
          lastName: createdUser.lastName,
          email: createdUser.email,
          phone: createdUser.phone || '',
          type: createdUser.type,
          isActive: createdUser.isActive,
          createdAt: createdUser.createdAt || new Date().toISOString(),
          updatedAt: createdUser.updatedAt || new Date().toISOString(),
        };
        setUsers([...users, newUser]);
      }
      
      setShowModal(false);
      setSelectedUser(null);
      setError(null);
    } catch (e: any) {
      console.error('Save failed', e);
      const errorMessage = e?.message || 'Failed to save user. Please try again.';
      setError(errorMessage);
    }
  };

  const handleCreateNew = () => {
    setSelectedUser(null);
    setError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <button
            onClick={handleCreateNew}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            ADD New User
          </button>
        </div>
      </div>

      {/* Filters */}
      <UserFilters
        searchTerm={searchTerm}
        filterRole={filterRole}
        filterStatus={filterStatus}
        filteredCount={filteredUsers.length}
        onSearchChange={setSearchTerm}
        onRoleChange={setFilterRole}
        onStatusChange={setFilterStatus}
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading users...</p>
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <UserTable
          users={filteredUsers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={selectedUser ? 'Edit User' : 'Create New User'}
      >
        <UserForm
          user={selectedUser}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
} 