import { sortBy } from 'lodash';

export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const printOptions = options.printOptions || { quote: 'single' };

  function transformToNamedExport(root, packageName, filterFn) {
    const lodashImports = root
      .find(j.ImportDeclaration)
      .filter((nodePath) => filterFn(nodePath.value.source.value));

    let firstNode;
    let replacementComments = [];
    let replacementSpecifiers = [];

    lodashImports.forEach((nodePath) => {
      if (nodePath.value.source.value === packageName) {
        replacementSpecifiers = replacementSpecifiers.concat(
          nodePath.value.specifiers
        );
      } else {
        const id = nodePath.value.source.value.replace(`${packageName}/`, '');
        const [specifier] = nodePath.value.specifiers;
        const name = specifier ? specifier.local.name : id;
        const replacementSpecifier = j.importSpecifier(
          j.identifier(id),
          j.identifier(name)
        );
        replacementSpecifiers.push(replacementSpecifier);
      }

      replacementComments = replacementComments.concat(
        nodePath.value.comments || []
      );

      if (!firstNode) {
        firstNode = nodePath;
      } else {
        j(nodePath).remove();
      }
    });

    if (firstNode) {
      firstNode.value.specifiers = sortBy(replacementSpecifiers, [
        'imported.name',
        (o) => (o.imported.name === o.local.name ? 0 : 1),
        'local.name',
      ]);
      firstNode.value.source.value = packageName;
      firstNode.value.comments = replacementComments;
    }
  }

  const root = j(file.source);
  transformToNamedExport(
    root,
    'lodash',
    (value) => value.startsWith('lodash') && !value.startsWith('lodash/fp')
  );
  transformToNamedExport(root, 'lodash/fp', (value) =>
    value.startsWith('lodash/fp')
  );
  return root.toSource(printOptions);
}
