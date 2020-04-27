const defineInlineTest = require('jscodeshift/dist/testUtils').defineInlineTest;
const transform = require('../named-import');

defineInlineTest(
  transform,
  {},
  `
import omit from 'lodash/omit';
  `,
  `
import { omit } from 'lodash';
  `,
  'Single import'
);

defineInlineTest(
  transform,
  {},
  `
import camel from 'lodash/camelCase';
  `,
  `
import { camelCase as camel } from 'lodash';
  `,
  'Single import'
);

defineInlineTest(
  transform,
  {},
  `
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';
  `,
  `
import { camelCase, omit } from 'lodash';
  `,
  'Two imports'
);

defineInlineTest(
  transform,
  {},
  `
import omit from 'lodash/omit';
import b from 'lodash/omit';
import a from 'lodash/omit';
import camelCase from 'lodash/camelCase';
  `,
  `
import { camelCase, omit, omit as a, omit as b } from 'lodash';
  `,
  'Two imports with sort'
);

defineInlineTest(
  transform,
  {},
  `
import b from 'lodash/omit';
import a from 'lodash/omit';
import omit from 'lodash/omit';
import { camelCase, find } from 'lodash';
import { omit as d } from 'lodash';
  `,
  `
import { camelCase, find, omit, omit as a, omit as b, omit as d } from 'lodash';
  `,
  'Mixed syntax'
);

defineInlineTest(
  transform,
  {},
  `
import React from 'react';
// isEmpty used because it works on arrays and objects
import isEmpty from 'lodash/isEmpty';
// Note that myMapValues is different from mapValues
import myMapValues from 'lodash/mapValues';
import { connect } from 'react-redux';
  `,
  `
import React from 'react';
// isEmpty used because it works on arrays and objects
// Note that myMapValues is different from mapValues
import { isEmpty, mapValues as myMapValues } from 'lodash';
import { connect } from 'react-redux';
  `,
  'Comments'
);

defineInlineTest(
  transform,
  {},
  `
import map from 'lodash/fp/map';
import mapKeys from 'lodash/fp/mapKeys';
import { findLastIndex } from 'lodash/fp';
import something from 'something';
import omit from 'lodash/omit';
import camelCase from 'lodash/camelCase';
import { chunk } from 'lodash';
import otherthing from 'otherthing';
  `,
  `
import { findLastIndex, map, mapKeys } from 'lodash/fp';
import something from 'something';
import { camelCase, chunk, omit } from 'lodash';
import otherthing from 'otherthing';
  `,
  'Mixed lodash with lodash/fp'
);

defineInlineTest(
  transform,
  { printOptions: { quote: 'double' } },
  `
import omit from "lodash/omit";
  `,
  `
import { omit } from "lodash";
  `,
  'Single import with double quote'
);
