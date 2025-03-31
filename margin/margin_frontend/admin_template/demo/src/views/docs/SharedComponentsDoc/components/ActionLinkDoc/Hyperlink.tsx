import ActionLink from '@/components/shared/ActionLink'

const Hyperlink = () => {
    return (
        <ActionLink reloadDocument to="https://www.google.com/" target="_blank">
            Navigate
        </ActionLink>
    )
}

export default Hyperlink
