const isDefault = s => s.type === 'ImportDefaultSpecifier' ||
        s.imported && s.imported.name === 'default';

const isNamespace = s => s.type === 'ImportNamespaceSpecifier';

export default ({source}, {jscodeshift: j}) => {
    const root = j(source);

  	// find es6 ImportDeclarations
    root.find(j.ImportDeclaration, {source: {value: 'react'}})
    	// which are not already ImportNamespaceSpecifier
        .filter(path => path.node.specifiers.every(s => !isNamespace(s)))
    	// ... and replace them
        .forEach(path => {
      		// find the default import (if there is one)
            const defaultImport = path.node.specifiers.find(isDefault);
      		// gather the remaining imports (if there are any)
            const imports = path.node.specifiers
                .filter(s => s !== defaultImport)
            	// and map them to Properties
            	// (which are later used to destructure the imported module)
                .map(({imported, local = imported}) => {
                    const prop = j.property('init', imported, local);
                    prop.shorthand = imported.name === local.name;
                    return prop;
                });

      		// decide what to use as local name in the file
            const id = defaultImport ? defaultImport.local.name : 'React';

      		// if there are named imports create a destructuring assignment
            const localAliases = imports.length ?
                j.variableDeclaration('const', [j.variableDeclarator(
                    j.objectPattern(imports),
                    j.identifier(id)
                )]) : undefined; 

      		// finally replace the importDeclaration with a namespace import
            j(path).replaceWith([
                j.importDeclaration(
                    [{type: 'ImportNamespaceSpecifier', id}],
                    j.literal('react')
                ),
                localAliases
            ])
        });

    return root.toSource({quote:'single'});
};
