module.exports = {
  env: {
    jest: 'true'
  },
  extends: ['standard'],
  rules: {
    'camelcase': [2, {
      'properties': 'always'
    }],
    'quote-props': ['error', 'as-needed', {
        'unnecessary': false
      }]
  }
}
