# jscodemods

Scripts to be used with [JSCodeshift](https://github.com/facebook/jscodeshift)


## React import namespace

Because React.js has no default export (it is not an es6 module),  
it should be imported like this: `import * as React from 'react';`  
or like this: `var React = require('react');`.

[See](https://github.com/rollup/rollup/issues/437#issuecomment-172785461)
[here](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/5128#issuecomment-131638288)
[for](https://github.com/rollup/rollup-plugin-node-resolve/issues/10#issuecomment-165187526)
[more](https://discuss.reactjs.org/t/es6-import-as-react-vs-import-react/360)
information.

This codemod rewrites all react imports to namespace import statements  
and creates destructuring assignments on the imported namespace for named imports.

This:
```js
import React, {Component, PropTypes} from 'react';
```
becomes this:
```js
import * as React from 'react';
const {Component, PropTypes} = React;
```
