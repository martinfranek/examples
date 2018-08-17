module.exports = {
  path: ':owner/:name',
  component: require('./Layout'),
  indexRoute: {
    title: 'Repository',
    component: require('./readme')
  },
  childRoutes: [
    {
      path: 'commits',
      childRoutes: [
        {
          path: ':sha',
          component: require('./commits')
        }
      ]
    },
    {
      path: 'issues',
      indexRoute: {
        component: require('./issues')
      },
      childRoutes: [
        {
          path: ':number',
          component: require('./issue-comments')
        }
      ]
    },
    {
      path: 'pulls',
      component: require('./pulls')
    },
    {
      path: '*'
    }
  ]
};
