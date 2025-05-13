import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { BsFacebook, BsTwitter, BsPinterest, BsLinkedin } from 'react-icons/bs'
import { Field, FormikErrors, FormikTouched } from 'formik'

type FormFieldsName = {
    facebook: string
    twitter: string
    pinterest: string
    linkedIn: string
}

type SocialLinkFormProps = {
    touched: FormikTouched<FormFieldsName>
    errors: FormikErrors<FormFieldsName>
}

const SocialLinkForm = (props: SocialLinkFormProps) => {
    const { touched, errors } = props

    return (
        <>
            <FormItem
                label="Facebook link"
                invalid={errors.facebook && touched.facebook}
                errorMessage={errors.facebook}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="facebook"
                    placeholder="URL"
                    component={Input}
                    prefix={<BsFacebook className="text-xl text-[#1773ea]" />}
                />
            </FormItem>
            <FormItem
                label="Twitter link"
                invalid={errors.twitter && touched.twitter}
                errorMessage={errors.twitter}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="twitter"
                    placeholder="URL"
                    component={Input}
                    prefix={<BsTwitter className="text-xl text-[#1da1f3]" />}
                />
            </FormItem>
            <FormItem
                label="Pinterest link"
                invalid={errors.pinterest && touched.pinterest}
                errorMessage={errors.pinterest}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="pinterest"
                    placeholder="URL"
                    component={Input}
                    prefix={<BsPinterest className="text-xl text-[#df0018]" />}
                />
            </FormItem>
            <FormItem
                label="LinkedIn link"
                invalid={errors.linkedIn && touched.linkedIn}
                errorMessage={errors.linkedIn}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="linkedIn"
                    placeholder="URL"
                    component={Input}
                    prefix={<BsLinkedin className="text-xl text-[#0077b5]" />}
                />
            </FormItem>
        </>
    )
}

export default SocialLinkForm
