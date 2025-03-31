import Segment from '@/components/ui/Segment'
import Upload from '@/components/ui/Upload'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { FormItem, FormContainer } from '@/components/ui/Form'
import SvgIcon from '@/components/shared/SvgIcon'
import DoubleSidedImage from '@/components/shared/DoubleSidedImage'
import SegmentItemOption from '@/components/shared/SegmentItemOption'
import { DriversLicenseSvg, PassportSvg, NationalIdSvg } from '@/assets/svg'
import classNames from 'classnames'
import {
    Field,
    Form,
    Formik,
    FieldProps,
    FormikTouched,
    FormikErrors,
    FormikProps,
    FieldInputProps,
} from 'formik'
import useThemeClass from '@/utils/hooks/useThemeClass'
import * as Yup from 'yup'
import type { Identification as IdentificationType } from '../store'
import type { PropsWithChildren } from 'react'

type FormModel = IdentificationType

type IdentificationProps = {
    data: IdentificationType
    onNextChange?: (
        values: FormModel,
        formName: string,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => void
    onBackChange?: () => void
    currentStepStatus?: string
}

type DocumentUploadFieldProps = PropsWithChildren<{
    label: string
    name: keyof IdentificationType
    touched: FormikTouched<IdentificationType>
    errors: FormikErrors<IdentificationType>
}>

const validationSchema = Yup.object().shape({
    documentType: Yup.string().required('Please select your document type'),
    passportCover: Yup.string().when('documentType', {
        is: 'passport',
        then: (schema) => schema.required('Please upload passport cover'),
        otherwise: (schema) => schema,
    }),
    passportDataPage: Yup.string().when('documentType', {
        is: 'passport',
        then: (schema) => schema.required('Please upload passport data page'),
        otherwise: (schema) => schema,
    }),
    nationalIdFront: Yup.string().when('documentType', {
        is: 'nationalId',
        then: (schema) =>
            schema.required('Please upload your front National ID'),
        otherwise: (schema) => schema,
    }),
    nationalIdBack: Yup.string().when('documentType', {
        is: 'nationalId',
        then: (schema) =>
            schema.required('Please upload your back National ID'),
        otherwise: (schema) => schema,
    }),
    driversLicenseFront: Yup.string().when('documentType', {
        is: 'driversLicense',
        then: (schema) =>
            schema.required('Please upload your front Drivers license'),
        otherwise: (schema) => schema,
    }),
    driversLicenseBack: Yup.string().when('documentType', {
        is: 'driversLicense',
        then: (schema) =>
            schema.required('Please upload your back Drivers license'),
        otherwise: (schema) => schema,
    }),
})

const documentTypes: {
    value: string
    label: string
    desc: string
    disabled?: boolean
}[] = [
    { value: 'passport', label: 'Passport', desc: '' },
    { value: 'nationalId', label: 'National ID', desc: '' },
    { value: 'driversLicense', label: 'Drivers License', desc: '' },
]

const documentUploadDescription: Record<string, string[]> = {
    passport: [
        'Uploaded passport image must be clearly visible & complete',
        'Passport must in valid period',
        'Provided passport data page must included your full name, date of birth & your photo',
    ],
    nationalId: [
        'Uploaded ID image must be clearly visible',
        'ID image must in valid period',
        'Provided ID must included your full name, date of birth & your photo',
    ],
    driversLicense: [
        'Uploaded driver license image must be clearly visible',
        'Driver license must in valid period',
        'Uploaded driver license image must be clearly visible',
    ],
}

const DocumentTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'passport':
            return <PassportSvg />
        case 'nationalId':
            return <NationalIdSvg />
        case 'driversLicense':
            return <DriversLicenseSvg />
        default:
            return null
    }
}

const DocumentUploadField = (props: DocumentUploadFieldProps) => {
    const { label, name, children, touched, errors } = props

    const onSetFormFile = (
        form: FormikProps<IdentificationType>,
        field: FieldInputProps<IdentificationType>,
        file: File[],
    ) => {
        form.setFieldValue(field.name, URL.createObjectURL(file[0]))
    }

    return (
        <FormItem
            label={label}
            invalid={errors[name] && touched[name]}
            errorMessage={errors[name]}
        >
            <Field name={name}>
                {({ field, form }: FieldProps) => (
                    <Upload
                        draggable
                        className="cursor-pointer h-[300px]"
                        showList={false}
                        uploadLimit={1}
                        onChange={(files) => onSetFormFile(form, field, files)}
                        onFileRemove={(files) =>
                            onSetFormFile(form, field, files)
                        }
                    >
                        {field.value ? (
                            <img
                                className="p-3 max-h-[300px]"
                                src={field.value}
                                alt=""
                            />
                        ) : (
                            <div className="text-center">
                                {children}
                                <p className="font-semibold">
                                    <span className="text-gray-800 dark:text-white">
                                        Drop your image here, or{' '}
                                    </span>
                                    <span className="text-blue-500">
                                        browse
                                    </span>
                                </p>
                                <p className="mt-1 opacity-60 dark:text-white">
                                    Support: jpeg, png
                                </p>
                            </div>
                        )}
                    </Upload>
                )}
            </Field>
        </FormItem>
    )
}

const Identification = ({
    data = {
        documentType: 'passport',
        passportCover: '',
        passportDataPage: '',
        nationalIdFront: '',
        nationalIdBack: '',
        driversLicenseFront: '',
        driversLicenseBack: '',
    },
    onNextChange,
    onBackChange,
    currentStepStatus,
}: IdentificationProps) => {
    const { textTheme, bgTheme } = useThemeClass()

    const onNext = (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        onNextChange?.(values, 'identification', setSubmitting)
    }

    const onBack = () => {
        onBackChange?.()
    }

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Identification</h3>
                <p>Upload relavant document to verify your identity.</p>
            </div>
            <Formik
                enableReinitialize
                initialValues={data}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    setSubmitting(true)
                    setTimeout(() => {
                        onNext(values, setSubmitting)
                    }, 1000)
                }}
            >
                {({ values, touched, errors, isSubmitting }) => {
                    const validatedProps = { touched, errors }
                    return (
                        <Form>
                            <FormContainer>
                                <FormItem
                                    label="Select your document type"
                                    invalid={
                                        errors.documentType &&
                                        touched.documentType
                                    }
                                    errorMessage={errors.documentType}
                                >
                                    <Field name="documentType">
                                        {({ field, form }: FieldProps) => (
                                            <Segment
                                                className="flex xl:items-center flex-col xl:flex-row gap-4"
                                                value={[field.value]}
                                                onChange={(val) =>
                                                    form.setFieldValue(
                                                        field.name,
                                                        val[0],
                                                    )
                                                }
                                            >
                                                <>
                                                    {documentTypes.map(
                                                        (item) => (
                                                            <Segment.Item
                                                                key={item.value}
                                                                value={
                                                                    item.value
                                                                }
                                                                disabled={
                                                                    item.disabled
                                                                }
                                                            >
                                                                {({
                                                                    active,
                                                                    value,
                                                                    onSegmentItemClick,
                                                                    disabled,
                                                                }) => {
                                                                    return (
                                                                        <SegmentItemOption
                                                                            active={
                                                                                active
                                                                            }
                                                                            disabled={
                                                                                disabled
                                                                            }
                                                                            className="w-full xl:w-[260px]"
                                                                            onSegmentItemClick={
                                                                                onSegmentItemClick
                                                                            }
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <SvgIcon
                                                                                    className={classNames(
                                                                                        'text-4xl ltr:mr-3 rtl:ml-3',
                                                                                        active &&
                                                                                            textTheme,
                                                                                    )}
                                                                                >
                                                                                    <DocumentTypeIcon
                                                                                        type={
                                                                                            value
                                                                                        }
                                                                                    />
                                                                                </SvgIcon>
                                                                                <h6>
                                                                                    {
                                                                                        item.label
                                                                                    }
                                                                                </h6>
                                                                            </div>
                                                                        </SegmentItemOption>
                                                                    )
                                                                }}
                                                            </Segment.Item>
                                                        ),
                                                    )}
                                                </>
                                            </Segment>
                                        )}
                                    </Field>
                                </FormItem>
                                <div className="mb-6">
                                    <h6>
                                        In order to complete upload and avoid
                                        delays when verifiying account, Please
                                        make sure bellow:
                                    </h6>
                                    <ul className="mt-4">
                                        {documentUploadDescription[
                                            values.documentType
                                        ].map((desc, index) => (
                                            <li
                                                key={desc + index}
                                                className="mb-2 flex items-center"
                                            >
                                                <Badge
                                                    className="rtl:ml-3 ltr:mr-3"
                                                    innerClass={bgTheme}
                                                />
                                                <span>{desc}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="grid xl:grid-cols-2 gap-4">
                                    {values.documentType === 'passport' && (
                                        <>
                                            <DocumentUploadField
                                                name="passportCover"
                                                label="Passport Cover"
                                                {...validatedProps}
                                            >
                                                <DoubleSidedImage
                                                    className="mx-auto mb-3"
                                                    src="/img/thumbs/passport.png"
                                                    darkModeSrc="/img/thumbs/passport-dark.png"
                                                    alt=""
                                                />
                                            </DocumentUploadField>
                                            <DocumentUploadField
                                                name="passportDataPage"
                                                label="Passport Data Page"
                                                {...validatedProps}
                                            >
                                                <DoubleSidedImage
                                                    className="mx-auto mb-3"
                                                    src="/img/thumbs/passport-data.png"
                                                    darkModeSrc="/img/thumbs/passport-data-dark.png"
                                                    alt=""
                                                />
                                            </DocumentUploadField>
                                        </>
                                    )}
                                    {values.documentType === 'nationalId' && (
                                        <>
                                            <DocumentUploadField
                                                name="nationalIdFront"
                                                label="National Id Front"
                                                {...validatedProps}
                                            >
                                                <DoubleSidedImage
                                                    className="mx-auto mb-3"
                                                    src="/img/thumbs/id-card-front.png"
                                                    darkModeSrc="/img/thumbs/id-card-front-dark.png"
                                                    alt=""
                                                />
                                            </DocumentUploadField>
                                            <DocumentUploadField
                                                name="nationalIdBack"
                                                label="National Id Back"
                                                {...validatedProps}
                                            >
                                                <DoubleSidedImage
                                                    className="mx-auto mb-3"
                                                    src="/img/thumbs/id-card-back.png"
                                                    darkModeSrc="/img/thumbs/id-card-back-dark.png"
                                                    alt=""
                                                />
                                            </DocumentUploadField>
                                        </>
                                    )}
                                    {values.documentType ===
                                        'driversLicense' && (
                                        <>
                                            <DocumentUploadField
                                                name="driversLicenseFront"
                                                label="Drivers License Front"
                                                {...validatedProps}
                                            >
                                                <DoubleSidedImage
                                                    className="mx-auto mb-3"
                                                    src="/img/thumbs/drivers-license-front.png"
                                                    darkModeSrc="/img/thumbs/drivers-license-front-dark.png"
                                                    alt=""
                                                />
                                            </DocumentUploadField>
                                            <DocumentUploadField
                                                name="driversLicenseBack"
                                                label="Drivers License Back"
                                                {...validatedProps}
                                            >
                                                <DoubleSidedImage
                                                    className="mx-auto mb-3"
                                                    src="/img/thumbs/drivers-license-back.png"
                                                    darkModeSrc="/img/thumbs/drivers-license-back-dark.png"
                                                    alt=""
                                                />
                                            </DocumentUploadField>
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button type="button" onClick={onBack}>
                                        Back
                                    </Button>
                                    <Button
                                        loading={isSubmitting}
                                        variant="solid"
                                        type="submit"
                                    >
                                        {currentStepStatus === 'complete'
                                            ? 'Save'
                                            : 'Next'}
                                    </Button>
                                </div>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </>
    )
}

export default Identification
