import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { ArrowLeft, Calendar, Tag, Eye } from 'lucide-react'
import hardcodedBlogs from '@/data/blogs.json'

const BlogPost = () => {
  const { id } = useParams<{ id: string }>()
  const { generatedContent } = useSelector((state: RootState) => state.ai)
  
  // Find the blog post by ID from both generated content and hardcoded blogs
  const allBlogs = [...generatedContent, ...hardcodedBlogs]
  const blogPost = allBlogs.find(blog => blog.id === id)

  // Simple markdown link renderer
  const renderContent = (content: string) => {
    return content.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">$1</a>'
    )
  }

  if (!blogPost) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link 
            to="/blog" 
            className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
        </div>
        
        <div className="card p-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link 
            to="/blog" 
            className="btn btn-primary"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center">
        <Link 
          to="/blog" 
          className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>

      {/* Blog Post Header */}
      <div className="card p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {blogPost.title}
          </h1>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(blogPost.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              {blogPost.status}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {blogPost.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 text-sm rounded-full flex items-center"
            >
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Blog Post Content */}
      <div className="card p-8">
        <div 
          className="prose dark:prose-invert max-w-none prose-lg"
          dangerouslySetInnerHTML={{ 
            __html: renderContent(blogPost.content).replace(/\n/g, '<br>') 
          }}
        />
      </div>

      {/* Related Actions */}
      <div className="card p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Enjoyed this post?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check out more articles in our blog for more insights and tips.
            </p>
          </div>
          <Link 
            to="/blog" 
            className="btn btn-primary"
          >
            View All Posts
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BlogPost
