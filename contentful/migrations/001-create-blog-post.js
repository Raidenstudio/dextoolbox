module.exports = function (migration) {
  const blogPost = migration.createContentType('blogPost', {
    name: 'Blog Post',
    description: 'Articles surfaced on the Dextoolbox blog and marketing pages',
    displayField: 'title'
  })

  blogPost.createField('title', {
    name: 'Title',
    type: 'Symbol',
    required: true,
    localized: false
  })

  blogPost.createField('slug', {
    name: 'Slug',
    type: 'Symbol',
    required: true,
    validations: [
      {
        unique: true
      },
      {
        regexp: {
          pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
        }
      }
    ]
  })

  blogPost.createField('excerpt', {
    name: 'Excerpt',
    type: 'Text',
    required: false
  })

  blogPost.createField('body', {
    name: 'Body',
    type: 'RichText',
    required: true,
    validations: [
      {
        enabledMarks: ['bold', 'italic', 'underline', 'code'],
        message: 'Only bold, italic, underline, and code marks are allowed.'
      },
      {
        nodes: {}
      }
    ]
  })

  blogPost.createField('tags', {
    name: 'Tags',
    type: 'Array',
    required: false,
    items: {
      type: 'Symbol'
    }
  })

  blogPost.createField('thumbnail', {
    name: 'Thumbnail URL',
    type: 'Symbol',
    required: false
  })

  blogPost.createField('publishedDate', {
    name: 'Published Date',
    type: 'Date',
    required: false
  })

  blogPost.createField('author', {
    name: 'Author',
    type: 'Symbol',
    required: false
  })

  blogPost.createField('readTime', {
    name: 'Read Time',
    type: 'Symbol',
    required: false
  })

  blogPost.createField('seoDescription', {
    name: 'SEO Description',
    type: 'Text',
    required: false
  })

  blogPost.createField('ogImage', {
    name: 'OG Image URL',
    type: 'Symbol',
    required: false
  })

  blogPost.changeFieldControl('title', 'builtin', 'singleLine')
  blogPost.changeFieldControl('slug', 'builtin', 'slugEditor')
  blogPost.changeFieldControl('excerpt', 'builtin', 'multipleLine')
  blogPost.changeFieldControl('body', 'builtin', 'richTextEditor')
  blogPost.changeFieldControl('tags', 'builtin', 'tagEditor')
  blogPost.changeFieldControl('thumbnail', 'builtin', 'singleLine')
  blogPost.changeFieldControl('ogImage', 'builtin', 'singleLine')
}
