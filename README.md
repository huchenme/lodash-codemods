# lodash-codemods ![Node.js CI](https://github.com/huchenme/lodash-codemods/workflows/Node.js%20CI/badge.svg?branch=master)

This repository contains a collection of codemod scripts for use with
[JSCodeshift](https://github.com/facebook/jscodeshift).

## Setup & Run

```sh
npm install -g jscodeshift
git clone https://github.com/huchenme/lodash-codemods.git
cd lodash-codemods
jscodeshift -t <codemod-script> <file/folder>
```

Use the `-d` option for a dry-run and use `-p` to print the output for comparison.

## Included Scripts

### `named-import`

If you are using [babel-plugin-lodash](https://github.com/lodash/babel-plugin-lodash), this codemod converts cherry-pick Lodash import to named import.

from

```js
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';
import map from 'lodash/fn/map';
import mapKeys from 'lodash/fn/mapKeys';
```

to

```js
import { camelCase, omit } from 'lodash';
import { map, mapKeys } from 'lodash/fn';
```

```sh
jscodeshift -t transforms/named-import.js <file/folder>
```

### Recast Options

[Options to recast's printer](https://github.com/benjamn/recast/blob/master/lib/options.ts) can be provided
through the `printOptions` command line argument

```sh
jscodeshift -t transforms/named-import.js <file/folder> --printOptions='{"quote":"double"}'
```
