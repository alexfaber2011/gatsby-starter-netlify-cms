const path = require("path");

function isPage(absolutePath, pageType) {
  switch (pageType) {
    case 'product':
      return absolutePath.indexOf('/src/pages/product/') > -1;
    case 'about':
      return absolutePath.indexOf('/src/pages/about/') > -1;
    case 'blog':
      return absolutePath.indexOf('/src/pages/blog/') > -1;
    case 'standard':
      return absolutePath.indexOf('/src/pages/standard-pages') > -1;
    default:
      return false;
  }
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  return graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            fileAbsolutePath
            frontmatter {
              templateKey
              path
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    return result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const pagePath = node.frontmatter.path;

      const absolutePath = node.fileAbsolutePath;

      const createPageOptions = {
        path: pagePath,
        component: path.resolve(
          `src/templates/product-page.js`
        ),
        // additional data can be passed via context
        context: {
          path: pagePath
        }
      }

      if (isPage(absolutePath, 'product')) {
        createPage(Object.assign(createPageOptions, {component: path.resolve(`src/templates/product-page.js`)}));
      } else if (isPage(absolutePath, 'about')) {
        createPage(Object.assign(createPageOptions, {component: path.resolve(`src/templates/about-page.js`)}));
      } else if (isPage(absolutePath, 'blog')) {
        createPage(Object.assign(createPageOptions, {component: path.resolve(`src/templates/blog-post.js`)}));
      } else if (isPage(absolutePath, 'standard')) {
        createPage(Object.assign(createPageOptions, {component: path.resolve(`src/templates/standard-page.js`)}));
      }
    });
  });
};
