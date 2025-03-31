import type { ComponentPropsWithoutRef } from 'react'

interface FormDesriptionProps extends ComponentPropsWithoutRef<'div'> {
    title: string
    desc: string
}

const FormDesription = ({ title, desc, ...rest }: FormDesriptionProps) => {
    return (
        <div {...rest}>
            <h5>{title}</h5>
            <p>{desc}</p>
        </div>
    )
}

export default FormDesription
