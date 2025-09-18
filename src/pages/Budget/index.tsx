import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { addBudgetItem, deleteBudgetItem } from '@/store/slices/budgetSlice'
import { Plus, Trash2, Edit } from 'lucide-react'
import toast from 'react-hot-toast'

const Budget = () => {
  const dispatch = useDispatch()
  const { items, categories } = useSelector((state: RootState) => state.budget)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.amount || !formData.category) {
      toast.error('Please fill in all required fields')
      return
    }

    dispatch(addBudgetItem({
      name: formData.name,
      amount: parseFloat(formData.amount),
      category: formData.category,
      type: formData.type,
      description: formData.description,
      date: new Date().toISOString(),
    }))

    setFormData({
      name: '',
      amount: '',
      category: '',
      type: 'expense',
      description: '',
    })
    setShowAddForm(false)
    toast.success('Budget item added successfully')
  }

  const handleDelete = (id: string) => {
    dispatch(deleteBudgetItem(id))
    toast.success('Budget item deleted')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Budget Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Track your income and expenses with AI-powered insights
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Add Transaction Form */}
      {showAddForm && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Name *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Transaction name"
                />
              </div>
              <div>
                <label className="label">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="label">Category *</label>
                <select
                  className="input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Type *</label>
                <select
                  className="input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="input"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transactions List */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No transactions yet. Add your first transaction to get started.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.type === 'income' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        item.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.type === 'income' ? '+' : '-'}${item.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Budget
