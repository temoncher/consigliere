module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'airbnb-typescript/base',
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/type-annotation-spacing': 1,
    '@typescript-eslint/no-empty-function': 1,
    '@typescript-eslint/lines-between-class-members': 0,
    '@typescript-eslint/explicit-function-return-type': 1,
    '@typescript-eslint/member-delimiter-style': [
      1,
      {
        'multiline': {
          'delimiter': 'semi',
          'requireLast': true,
        },
      },
    ],
    'import/no-unresolved': 0, // disabled for typescript aliases
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'import/order': [
      'warn',
      {
        'groups': [
          'builtin',
          'external',
          'parent',
          'sibling',
          'index'
        ],
        'pathGroups': [
          {
            'pattern': '@/**',
            'group': 'parent',
            'position': 'before'
          },
          {
            'pattern': '~/**',
            'group': 'parent',
            'position': 'before'
          }
        ],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': false
        },
        'pathGroupsExcludedImportTypes': [
          'builtin'
        ]
      }
    ],
    'no-undef': 0,
    'no-debugger': 2,
    'no-useless-constructor': 0,
    'no-var': 2,
    'no-new': 0,
    'no-console': 1,
    'no-return-assign': 0,
    'no-duplicate-imports': 2,
    'max-classes-per-file': 0,
    'class-methods-use-this': 0,
    'linebreak-style': 0,
    'lines-between-class-members': 0,
    'object-curly-newline': 0,
    'quote-props': 0,
    'semi': [
      2,
      'always',
    ],
    'comma-dangle': [
      2,
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'only-multiline', // 'always-' conflicts with multiline webpack dynamic imports
      },
    ],
    'no-multiple-empty-lines': [
      1,
      {
        'max': 1,
      },
    ],
    'eol-last': [
      1,
      'always',
    ],
    'padding-line-between-statements': [
      1,
      {
        'blankLine': 'always',
        'prev': [
          'const',
          'let',
          'var',
        ],
        'next': '*',
      },
      {
        'blankLine': 'always',
        'prev': '*',
        'next': [
          'if',
          'try',
          'class',
          'export',
        ],
      },
      {
        'blankLine': 'always',
        'prev': [
          'if',
          'try',
          'class',
          'export',
        ],
        'next': '*',
      },
      {
        'blankLine': 'any',
        'prev': [
          'const',
          'let',
          'var',
          'export',
        ],
        'next': [
          'const',
          'let',
          'var',
          'export',
        ],
      },
    ],
    'block-spacing': 1,
    'comma-spacing': [
      1,
      {
        'before': false,
        'after': true,
      },
    ],
    'func-call-spacing': [
      1,
      'never',
    ],
    'newline-before-return': 1,
    'object-curly-spacing': [
      1,
      'always',
      {
        'arraysInObjects': true,
        'objectsInObjects': true,
      },
    ],
    'padded-blocks': [
      1,
      'never',
    ],
    'max-len': [
      1,
      {
        'code': 120,
      },
    ],
  },
};
