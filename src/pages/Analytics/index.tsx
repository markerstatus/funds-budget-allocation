import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const Analytics = () => {
  const { items, categories, totalIncome, totalExpenses } = useSelector(
    (state: RootState) => state.budget
  )

  // Prepare data for charts
  const categoryData = categories.map(category => ({
    name: category.name,
    spent: category.spent,
    limit: category.limit || 0,
    color: category.color,
  }))

  const monthlyData = items.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleDateString('en-US', { month: 'short' })
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0 }
    }
    if (item.type === 'income') {
      acc[month].income += item.amount
    } else {
      acc[month].expenses += item.amount
    }
    return acc
  }, {} as Record<string, { month: string; income: number; expenses: number }>)

  const monthlyChartData = Object.values(monthlyData)

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Visualize your spending patterns and financial trends
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Income
          </h3>
          <p className="text-3xl font-bold text-green-600">
            ${totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Total Expenses
          </h3>
          <p className="text-3xl font-bold text-red-600">
            ${totalExpenses.toLocaleString()}
          </p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Net Balance
          </h3>
          <p className={`text-3xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${(totalIncome - totalExpenses).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Income vs Expenses */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Income vs Expenses
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, '']} />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Spending */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Spending by Category
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="spent"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Spent']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Category Breakdown
        </h3>
        <div className="space-y-4">
          {categoryData.map((category) => {
            const percentage = category.limit > 0 ? (category.spent / category.limit) * 100 : 0
            return (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ${category.spent.toLocaleString()} / ${category.limit.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {percentage.toFixed(1)}% of budget used
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Analytics
