/**
 * We are using the .JS version of an ESLint config file here so that we can
 * add lots of comments to better explain and document the setup.
 */
module.exports = {
  /**
   * See packages/eslint-plugin/src/configs/README.md
   * for what this recommended config contains.
   */
  extends: ['plugin:@angular-eslint/recommended'],
  rules: {
    // ORIGINAL tslint.json -> 'directive-selector': [true, 'attribute', 'app', 'camelCase'],
    '@angular-eslint/directive-selector': [
      'error',
      { type: 'attribute', prefix: 'app', style: 'camelCase' },
    ],

    // ORIGINAL tslint.json -> 'component-selector': [true, 'element', 'app', 'kebab-case'],
    '@angular-eslint/component-selector': [
      'error',
      { type: 'element', prefix: 'app', style: 'kebab-case' },
    ],
  },
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': 2,
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/explicit-function-return-type': 1,
        '@typescript-eslint/no-useless-constructor': 0, // disabled for default component template
        '@typescript-eslint/unbound-method': 0, // disabled for NgXS getters
        '@typescript-eslint/lines-between-class-members': 0,
        'import/prefer-default-export': 0, // disabled for components exports
        'no-return-assign': 0,
        'no-restricted-globals': 1, // TODO: can be enabled and dealt with later
        'no-restricted-syntax': 0, // disabled to enable for loops
        'max-classes-per-file': 0, // disabled for NgXS action types
        'linebreak-style': 0,
        'object-curly-newline': 0,
        'class-methods-use-this': 0, // disabled for ngOnInit
        '@typescript-eslint/member-delimiter-style': [
          'warn',
          {
            multiline: {
              delimiter: 'semi',
              requireLast: true,
            },
          },
        ],
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'import/order': [
          'error',
          {
            'newlines-between': 'always',
            'pathGroups': [
              {
                'pattern': '@/**',
                'group': 'parent',
                'position': 'before'
              }
            ],
            'alphabetize': {
              'order': 'asc',
              'caseInsensitive': true
            },
            'pathGroupsExcludedImportTypes': ['builtin']
          }
        ],
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'no-multiple-empty-lines': [
          'warn',
          {
            max: 1,
          },
        ],
        'eol-last': ['warn', 'always'],
        'padding-line-between-statements': [
          'warn',
          {
            blankLine: 'always',
            prev: ['const', 'let', 'var'],
            next: '*',
          },
          {
            blankLine: 'always',
            prev: '*',
            next: ['if', 'try', 'class', 'export'],
          },
          {
            blankLine: 'always',
            prev: ['if', 'try', 'class', 'export'],
            next: '*',
          },
          {
            blankLine: 'any',
            prev: ['const', 'let', 'var', 'export'],
            next: ['const', 'let', 'var', 'export'],
          },
        ],
        'block-spacing': 'warn',
        'comma-spacing': [
          'warn',
          {
            before: false,
            after: true,
          },
        ],
        'func-call-spacing': ['warn', 'never'],
        'newline-before-return': 'warn',
        'object-curly-spacing': [
          'warn',
          'always',
          {
            arraysInObjects: true,
            objectsInObjects: true,
          },
        ],
        'padded-blocks': ['warn', 'never'],
        'max-len': [
          'warn',
          {
            code: 120,
          },
        ],
      },
    },
    {
      files: ['src/**/*.spec.ts', 'src/**/*.d.ts'],
      parserOptions: {
        project: './tsconfig.spec.json',
      },
      extends: ['plugin:jasmine/recommended'],
      plugins: ['jasmine'],
      env: { jasmine: true },
      rules: {
        '@typescript-eslint/no-unused-vars': 0,
      },
    },
    {
      files: ['cypress/**/*.ts'],
      parserOptions: {
        project: './cypress/tsconfig.json',
      },
      extends: ['plugin:cypress/recommended'],
      plugins: ['cypress'],
      env: {
        'cypress/globals': true,
      },
      rules: {
        '@typescript-eslint/no-namespace': 0, // for cypress commands
        'cypress/no-unnecessary-waiting': 0, // to wait for modals
        'no-underscore-dangle': 0, // for programmatic methods
        'no-redeclare': 0, // for cypress commands
      },
    },
  ],
};
