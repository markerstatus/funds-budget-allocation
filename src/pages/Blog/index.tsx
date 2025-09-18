import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState } from '@/store'
import { addGeneratedContent, AIGeneratedContent, updateGeneratedContent } from '@/store/slices/aiSlice'
import { useAI } from '@/hooks/useAI'
import { Plus, Edit, Eye, Trash2, Brain } from 'lucide-react'
import toast from 'react-hot-toast'
import hardcodedBlogs from '@/data/blogs.json'

const Blog = () => {
  const dispatch = useDispatch()
  const { generatedContent } = useSelector((state: RootState) => state.ai)
  const { generateBlogPost, isAnalyzing } = useAI()
  
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [generateForm, setGenerateForm] = useState({
    topic: '',
    style: 'professional' as 'professional' | 'casual' | 'technical',
  })

  // Combine hardcoded blogs with generated content
  const allBlogs = [...hardcodedBlogs, ...generatedContent]

  const handleGeneratePost = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!generateForm.topic.trim()) {
      toast.error('Please enter a topic')
      return
    }

    try {
      await generateBlogPost(generateForm.topic, generateForm.style)
      setGenerateForm({ topic: '', style: 'professional' })
      setShowGenerateForm(false)
      toast.success('Blog post generated successfully!')
    } catch (error) {
      toast.error('Failed to generate blog post')
    }
  }

  const handleCancelGenerate = () => {
    setShowGenerateForm(false)
    setGenerateForm({ topic: '', style: 'professional' })
  }

  const handlePublish = (id: string) => {
    const content = generatedContent.find((c: AIGeneratedContent) => c.id === id)
    if (content) {
      dispatch(updateGeneratedContent({ ...content, status: 'published' }))
      toast.success('Blog post published!')
    }
  }

  const handleArchive = (id: string) => {
    const content = generatedContent.find((c: AIGeneratedContent) => c.id === id)
    if (content) {
      dispatch(updateGeneratedContent({ ...content, status: 'archived' }))
      toast.success('Blog post archived!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Blog Generator</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create engaging blog posts about your financial journey with AI
          </p>
        </div>
        <button
          onClick={() => setShowGenerateForm(!showGenerateForm)}
          className="btn btn-primary flex items-center"
          disabled={isAnalyzing}
        >
          <Brain className="h-5 w-5 mr-2" />
          {isAnalyzing ? 'Generating...' : showGenerateForm ? 'Cancel' : 'Generate Post'}
        </button>
      </div>

      {/* Generate Form */}
      {showGenerateForm && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Generate New Blog Post</h2>
          <form onSubmit={handleGeneratePost} className="space-y-4">
            <div>
              <label className="label">Topic *</label>
              <input
                type="text"
                className="input"
                value={generateForm.topic}
                onChange={(e) => setGenerateForm({ ...generateForm, topic: e.target.value })}
                placeholder="e.g., 'How to Save Money on Groceries', 'Investment Strategies for Beginners'"
              />
            </div>
            <div>
              <label className="label">Writing Style</label>
              <select
                className="input"
                value={generateForm.style}
                onChange={(e) => setGenerateForm({ ...generateForm, style: e.target.value as any })}
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="technical">Technical</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelGenerate}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Generating...' : 'Generate Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Blog Posts */}
      <div className="space-y-6">
        {allBlogs.length === 0 ? (
          <div className="card p-12 text-center">
            <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No blog posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Generate your first AI-powered blog post to get started
            </p>
            <button
              onClick={() => setShowGenerateForm(true)}
              className="btn btn-primary"
            >
              Create First Post
            </button>
          </div>
        ) : (
          allBlogs.map((post: AIGeneratedContent) => (
            <div key={post.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {post.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Created: {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      post.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {post.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(post.id)}
                      className="btn btn-primary text-sm"
                    >
                      Publish
                    </button>
                  )}
                  {post.status === 'published' && (
                    <button
                      onClick={() => handleArchive(post.id)}
                      className="btn btn-secondary text-sm"
                    >
                      Archive
                    </button>
                  )}
                  <button className="btn btn-secondary text-sm">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">
                  {post.content.substring(0, 300)}...
                </p>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <Link 
                  to={`/blog/${post.id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Read Full Post
                </Link>
                <button className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Blog
