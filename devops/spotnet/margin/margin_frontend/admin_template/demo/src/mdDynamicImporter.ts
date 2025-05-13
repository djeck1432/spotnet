const mdDynamicImporter = async (
    mdPath = '',
    mdName = '',
    mdPrefixPath = 'ui-components',
) => {
    const file = await import(
        `./assets/markdown/${mdPrefixPath}/${mdPath}/${mdName}.md`
    )
    return file
}

export default mdDynamicImporter
