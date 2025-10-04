import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog'

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.underlayx.com'
  const blogPosts = getAllBlogPosts()
  const staticDate = new Date('2024-02-05')
  
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/custom-editor`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/text-behind-image`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/shape-behind-image`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/remove-background`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/overlay-image`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/draw-behind-image`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/clone-image`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/change-background`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/photo-editor`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: staticDate,
      changeFrequency: 'daily' as ChangeFrequency,
      priority: 1,
    }
  ]

  const blogRoutes = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as ChangeFrequency,
    priority: 0.8,
  }))

  return [...staticRoutes, ...blogRoutes]
}
