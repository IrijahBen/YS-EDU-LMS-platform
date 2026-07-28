import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Shield, ShieldOff, Trash2, CheckCircle, XCircle, 
  UserCheck, UserX, Clock, Mail, ShieldAlert 
} from 'lucide-react';
import { userService } from '../../services/api';
import { formatDate, getInitials } from '../../lib/utils';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'active', 'banned'
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 });

  useEffect(() => {
    loadUsers();
  }, [search, roleFilter, statusFilter]);

  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      // Assuming your backend can accept an 'isApproved' or 'isBanned' query param based on statusFilter
      // If not, it will just fetch all and we can filter locally, but server-side is better.
      const queryParams = { search, role: roleFilter, page, limit: 20 };
      
      if (statusFilter === 'pending') queryParams.isApproved = false;
      if (statusFilter === 'active') { queryParams.isApproved = true; queryParams.isBanned = false; }
      if (statusFilter === 'banned') queryParams.isBanned = true;

      const { data } = await userService.getAllUsers(queryParams);
      setUsers(data.users);
      setPagination({ total: data.total, pages: data.pages, currentPage: data.currentPage });
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // ─── NEW: APPROVAL ACTIONS ───────────────────────────────────────────────
  const handleApprove = async (user) => {
    try {
      // Make sure to add approveUser to your userService/api.js
      await userService.approveUser(user._id);
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isApproved: true } : u));
      toast.success(`${user.name} has been approved!`);
    } catch {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (user) => {
    if (!window.confirm(`Are you sure you want to reject and delete ${user.name}'s registration?`)) return;
    try {
      // Make sure to add rejectUser to your userService/api.js
      await userService.rejectUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success('Registration rejected');
    } catch {
      toast.error('Failed to reject user');
    }
  };

  // ─── EXISTING ACTIONS ────────────────────────────────────────────────────
  const handleBan = async (user) => {
    const reason = user.isBanned ? undefined : window.prompt('Reason for banning:');
    if (!user.isBanned && !reason) return;
    try {
      await userService.toggleBanUser(user._id, reason);
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isBanned: !u.isBanned } : u));
      toast.success(user.isBanned ? 'User unbanned successfully' : 'User banned successfully');
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await userService.updateUserRole(userId, role);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, role } : u));
      toast.success('Role updated successfully');
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name}? This cannot be undone.`)) return;
    try {
      await userService.deleteUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage accounts, roles, and pending approvals.</p>
        </div>
        <div className="bg-[#0A3D62] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-blue-900/20">
          {pagination.total} Total Users
        </div>
      </div>

      {/* Control Panel (Search & Filters) */}
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col lg:flex-row gap-4 justify-between">
        
        {/* Status Segmented Control */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl overflow-x-auto custom-scrollbar">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'pending', label: 'Pending Approvals' },
            { id: 'active', label: 'Active' },
            { id: 'banned', label: 'Banned' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-white dark:bg-gray-700 text-[#0A3D62] dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
              {tab.id === 'pending' && users.some(u => !u.isApproved) && (
                <span className="ml-2 w-2 h-2 rounded-full bg-amber-500 inline-block animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Search & Role Filter */}
        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#0A3D62]/50 outline-none text-sm font-medium transition-all"
            />
          </div>
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)} 
            className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#0A3D62]/50 transition-all cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <LoadingSpinner size="lg" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <UserX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-xs text-gray-500 uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4 hidden md:table-cell">Joined</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {users.map((u) => (
                    <motion.tr 
                      key={u._id}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {u.avatar?.url ? (
                            <img src={u.avatar.url} alt="" className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-200 dark:border-gray-700" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A3D62] to-blue-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                              {getInitials(u.name)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{u.name}</p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" /> {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell font-medium">
                        {formatDate(u.createdAt)}
                      </td>
                      
                      <td className="px-6 py-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className={`text-xs font-bold uppercase tracking-wide border-0 rounded-lg px-3 py-1.5 cursor-pointer appearance-none outline-none ring-1 ring-inset ${
                            u.role === 'admin' ? 'bg-purple-50 text-purple-700 ring-purple-200 dark:bg-purple-900/20 dark:ring-purple-900/50' : 
                            u.role === 'instructor' ? 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/20 dark:ring-blue-900/50' : 
                            'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700'
                          }`}
                          disabled={u.role === 'admin'}
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      
                      <td className="px-6 py-4">
                        {!u.isApproved ? (
                           <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs px-2.5 py-1 rounded-full font-bold ring-1 ring-inset ring-amber-200/50 dark:ring-amber-900/50">
                             <Clock className="w-3.5 h-3.5" /> Pending
                           </span>
                        ) : u.isBanned ? (
                           <span className="inline-flex items-center gap-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs px-2.5 py-1 rounded-full font-bold ring-1 ring-inset ring-red-200/50 dark:ring-red-900/50">
                             <ShieldAlert className="w-3.5 h-3.5" /> Banned
                           </span>
                        ) : (
                           <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs px-2.5 py-1 rounded-full font-bold ring-1 ring-inset ring-green-200/50 dark:ring-green-900/50">
                             <CheckCircle className="w-3.5 h-3.5" /> Active
                           </span>
                        )}
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* SHOW APPROVE/REJECT IF PENDING */}
                          {!u.isApproved ? (
                            <>
                              <button 
                                onClick={() => handleApprove(u)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-600 text-white hover:bg-green-500 transition-colors shadow-sm"
                              >
                                <UserCheck className="w-4 h-4" /> Approve
                              </button>
                              <button 
                                onClick={() => handleReject(u)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-red-600 hover:bg-red-50 hover:text-red-700 dark:bg-gray-800 dark:hover:bg-red-900/30 transition-colors border border-gray-200 dark:border-gray-700"
                              >
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                            </>
                          ) : (
                            /* SHOW NORMAL CONTROLS IF APPROVED */
                            u.role !== 'admin' && (
                              <>
                                <button 
                                  onClick={() => handleBan(u)}
                                  className={`p-2 rounded-lg transition-colors border ${
                                    u.isBanned 
                                      ? 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800' 
                                      : 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-900/20 dark:border-amber-800'
                                  }`}
                                  title={u.isBanned ? 'Unban User' : 'Ban User'}
                                >
                                  {u.isBanned ? <Shield className="w-4 h-4" /> : <ShieldOff className="w-4 h-4" />}
                                </button>
                                
                                <button 
                                  onClick={() => handleDelete(u)}
                                  className="p-2 rounded-lg text-red-500 bg-red-50 border border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900/30 dark:hover:bg-red-900/40 transition-colors"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button 
                key={page} 
                onClick={() => loadUsers(page)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  page === pagination.currentPage 
                    ? 'bg-[#0A3D62] text-white shadow-md' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
