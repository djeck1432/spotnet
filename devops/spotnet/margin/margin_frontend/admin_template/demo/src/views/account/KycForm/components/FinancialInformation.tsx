import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { FormItem, FormContainer } from '@/components/ui/Form'
import { Field, Form, Formik, getIn, FieldInputProps, FieldProps } from 'formik'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import {
    occupationOptions,
    annualIncomeOptions,
    sourceOfWealthOptions,
    noTinReasonOption,
} from '../constants'
import { countryList } from '@/constants/countries.constant'
import * as Yup from 'yup'
import type { ComponentType } from 'react'
import type { FinancialInformation as FinancialInformationType } from '../store'
import type { InputProps } from '@/components/ui/Input'

type FormModel = FinancialInformationType

type NoTinReasonOption = {
    label: string
    value: number | string
}

type FinancialInformationProps = {
    data: FinancialInformationType
    onNextChange?: (
        values: FormModel,
        formName: string,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => void
    onBackChange?: () => void
    currentStepStatus?: string
}

const excludedOccupation = ['unemployed', 'student', 'retired']

const validationSchema = Yup.object().shape({
    taxResident: Yup.string().required(
        'Please select your country of tax resident',
    ),
    tin: Yup.string().when('noTin', {
        is: false,
        then: (schema) =>
            schema.required(
                'Please enter your Taxpayer Identification number (TIN)',
            ),
        otherwise: (schema) => schema,
    }),
    noTinReason: Yup.string().when('noTin', {
        is: true,
        then: (schema) => schema.required('Please indicate your reason'),
        otherwise: (schema) => schema,
    }),
    noTin: Yup.bool(),
    occupation: Yup.string().required('Please choose your occupation'),
    annualIncome: Yup.string().required(
        'Please tell us your annual income range',
    ),
    sourceOfWealth: Yup.string().required(
        'Please tell us the source of funds use in this account',
    ),
    companyInformation: Yup.object().when('occupation', {
        is: (value: string) => value && !excludedOccupation.includes(value),
        then: (schema) =>
            schema.shape({
                companyName: Yup.string().required(
                    'Please enter your company name',
                ),
                contactNumber: Yup.string().required(
                    'Please enter your company contact number',
                ),
                country: Yup.string().required('Please select country'),
                addressLine1: Yup.string().required(
                    'Please enter your address',
                ),
                addressLine2: Yup.string(),
                city: Yup.string().required('Please enter your city'),
                state: Yup.string().required('Please enter your state'),
                zipCode: Yup.string().required('Please enter zip code'),
            }),
        otherwise: (schema) => schema,
    }),
})

const NumberInput = (props: InputProps) => {
    return <Input {...props} value={props.field.value} />
}

const NumericFormatInput = ({
    onValueChange,
    ...rest
}: Omit<NumericFormatProps, 'form'> & {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    form: any
    field: FieldInputProps<unknown>
}) => {
    return (
        <NumericFormat
            customInput={Input as ComponentType}
            type="text"
            autoComplete="off"
            onValueChange={onValueChange}
            {...rest}
        />
    )
}

const FinancialInformation = ({
    data = {
        taxResident: '',
        tin: '',
        noTin: false,
        noTinReason: '',
        occupation: '',
        annualIncome: '',
        sourceOfWealth: '',
        companyInformation: {
            companyName: '',
            contactNumber: '',
            country: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            state: '',
            zipCode: '',
        },
    },
    onNextChange,
    onBackChange,
    currentStepStatus,
}: FinancialInformationProps) => {
    const onNext = (
        values: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        onNextChange?.(values, 'financialInformation', setSubmitting)
    }

    const onBack = () => {
        onBackChange?.()
    }

    return (
        <>
            <div className="mb-8">
                <h3 className="mb-2">Financial Information</h3>
                <p>
                    Fill in your financial information to help us speed up the
                    verication process.
                </p>
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
                    return (
                        <Form>
                            <FormContainer>
                                <div>
                                    <h5 className="mb-4">Tax Information</h5>
                                    <div className="md:grid grid-cols-2 gap-4">
                                        <FormItem
                                            label="Tax resident of"
                                            invalid={
                                                errors.taxResident &&
                                                touched.taxResident
                                            }
                                            errorMessage={errors.taxResident}
                                        >
                                            <Field name="taxResident">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <Select
                                                        placeholder="Tax resident of"
                                                        field={field}
                                                        form={form}
                                                        options={countryList}
                                                        value={countryList.filter(
                                                            (country) =>
                                                                country.value ===
                                                                values.taxResident,
                                                        )}
                                                        onChange={(country) =>
                                                            form.setFieldValue(
                                                                field.name,
                                                                country?.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        {values.noTin ? (
                                            <FormItem
                                                label="Please provide an appropriate reason if no TIN"
                                                invalid={
                                                    errors.noTinReason &&
                                                    touched.noTinReason
                                                }
                                                errorMessage={
                                                    errors.noTinReason
                                                }
                                            >
                                                <Field name="noTinReason">
                                                    {({
                                                        field,
                                                        form,
                                                    }: FieldProps) => (
                                                        <Select<NoTinReasonOption>
                                                            placeholder="Select reason"
                                                            field={field}
                                                            form={form}
                                                            options={
                                                                noTinReasonOption
                                                            }
                                                            value={noTinReasonOption.filter(
                                                                (reason) =>
                                                                    reason.value ===
                                                                    values.noTinReason,
                                                            )}
                                                            onChange={(
                                                                reason,
                                                            ) =>
                                                                form.setFieldValue(
                                                                    field.name,
                                                                    reason?.value,
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Field>
                                            </FormItem>
                                        ) : (
                                            <FormItem
                                                label="Taxpayer Identification number (TIN)"
                                                invalid={
                                                    errors.tin && touched.tin
                                                }
                                                errorMessage={errors.tin}
                                            >
                                                <Field
                                                    type="text"
                                                    autoComplete="off"
                                                    name="tin"
                                                    placeholder="TIN"
                                                    component={Input}
                                                />
                                            </FormItem>
                                        )}
                                    </div>
                                </div>
                                <FormItem>
                                    <Field name="noTin" component={Checkbox}>
                                        Check this if no TIN number is available
                                    </Field>
                                </FormItem>
                                <div>
                                    <h5 className="mb-4">
                                        Employment Information
                                    </h5>
                                    <FormItem
                                        label="Occupation"
                                        invalid={
                                            errors.occupation &&
                                            touched.occupation
                                        }
                                        errorMessage={errors.occupation}
                                    >
                                        <Field name="occupation">
                                            {({ field, form }: FieldProps) => (
                                                <Select
                                                    placeholder="Occupation"
                                                    field={field}
                                                    form={form}
                                                    options={occupationOptions}
                                                    value={occupationOptions.filter(
                                                        (status) =>
                                                            status.value ===
                                                            values.occupation,
                                                    )}
                                                    onChange={(status) =>
                                                        form.setFieldValue(
                                                            field.name,
                                                            status?.value,
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                    </FormItem>
                                    {values.occupation &&
                                        !excludedOccupation.includes(
                                            values.occupation,
                                        ) && (
                                            <div>
                                                <div className="md:grid grid-cols-2 gap-4">
                                                    <FormItem
                                                        label="Full company name"
                                                        invalid={
                                                            getIn(
                                                                errors,
                                                                'companyInformation.companyName',
                                                            ) &&
                                                            getIn(
                                                                touched,
                                                                'companyInformation.companyName',
                                                            )
                                                        }
                                                        errorMessage={getIn(
                                                            errors,
                                                            'companyInformation.companyName',
                                                        )}
                                                    >
                                                        <Field
                                                            type="text"
                                                            autoComplete="off"
                                                            name="companyInformation.companyName"
                                                            placeholder="Full company name"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                    <FormItem
                                                        label="Employer Contact Number"
                                                        invalid={
                                                            errors.companyInformation &&
                                                            errors
                                                                .companyInformation
                                                                .contactNumber &&
                                                            touched
                                                                .companyInformation
                                                                ?.contactNumber
                                                        }
                                                        errorMessage={
                                                            errors.companyInformation &&
                                                            errors
                                                                .companyInformation
                                                                .contactNumber
                                                        }
                                                    >
                                                        <Field name="companyInformation.contactNumber">
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => {
                                                                return (
                                                                    <NumericFormatInput
                                                                        form={
                                                                            form
                                                                        }
                                                                        field={
                                                                            field
                                                                        }
                                                                        customInput={
                                                                            NumberInput as ComponentType
                                                                        }
                                                                        placeholder="Employer Contact Number"
                                                                        onValueChange={(
                                                                            e,
                                                                        ) => {
                                                                            form.setFieldValue(
                                                                                field.name,
                                                                                e.value,
                                                                            )
                                                                        }}
                                                                    />
                                                                )
                                                            }}
                                                        </Field>
                                                    </FormItem>
                                                </div>
                                                <div className="md:grid grid-cols-2 gap-4">
                                                    <FormItem
                                                        label="Country"
                                                        invalid={
                                                            getIn(
                                                                errors,
                                                                'companyInformation.country',
                                                            ) &&
                                                            getIn(
                                                                touched,
                                                                'companyInformation.country',
                                                            )
                                                        }
                                                        errorMessage={getIn(
                                                            errors,
                                                            'companyInformation.country',
                                                        )}
                                                    >
                                                        <Field name="companyInformation.country">
                                                            {({
                                                                field,
                                                                form,
                                                            }: FieldProps) => (
                                                                <Select
                                                                    placeholder="Country"
                                                                    field={
                                                                        field
                                                                    }
                                                                    form={form}
                                                                    options={
                                                                        countryList
                                                                    }
                                                                    value={countryList.filter(
                                                                        (c) =>
                                                                            c.value ===
                                                                            getIn(
                                                                                values,
                                                                                'companyInformation.country',
                                                                            ),
                                                                    )}
                                                                    onChange={(
                                                                        c,
                                                                    ) =>
                                                                        form.setFieldValue(
                                                                            field.name,
                                                                            c?.value,
                                                                        )
                                                                    }
                                                                />
                                                            )}
                                                        </Field>
                                                    </FormItem>
                                                    <FormItem
                                                        label="Address Line 1"
                                                        invalid={
                                                            getIn(
                                                                errors,
                                                                'companyInformation.addressLine1',
                                                            ) &&
                                                            getIn(
                                                                touched,
                                                                'companyInformation.addressLine1',
                                                            )
                                                        }
                                                        errorMessage={getIn(
                                                            errors,
                                                            'companyInformation.addressLine1',
                                                        )}
                                                    >
                                                        <Field
                                                            type="text"
                                                            autoComplete="off"
                                                            name="companyInformation.addressLine1"
                                                            placeholder="Company address line 1"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                </div>
                                                <div className="md:grid grid-cols-2 gap-4">
                                                    <FormItem
                                                        label="Address Line 2"
                                                        invalid={
                                                            getIn(
                                                                errors,
                                                                'companyInformation.addressLine2',
                                                            ) &&
                                                            getIn(
                                                                touched,
                                                                'companyInformation.addressLine2',
                                                            )
                                                        }
                                                        errorMessage={getIn(
                                                            errors,
                                                            'companyInformation.addressLine2',
                                                        )}
                                                    >
                                                        <Field
                                                            type="text"
                                                            autoComplete="off"
                                                            name="companyInformation.addressLine2"
                                                            placeholder="Company address line 2"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                    <FormItem
                                                        label="City"
                                                        invalid={
                                                            getIn(
                                                                errors,
                                                                'companyInformation.city',
                                                            ) &&
                                                            getIn(
                                                                touched,
                                                                'companyInformation.city',
                                                            )
                                                        }
                                                        errorMessage={getIn(
                                                            errors,
                                                            'companyInformation.city',
                                                        )}
                                                    >
                                                        <Field
                                                            type="text"
                                                            autoComplete="off"
                                                            name="companyInformation.city"
                                                            placeholder="City"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                </div>
                                                <div className="md:grid grid-cols-2 gap-4">
                                                    <FormItem
                                                        label="State"
                                                        invalid={
                                                            getIn(
                                                                errors,
                                                                'companyInformation.state',
                                                            ) &&
                                                            getIn(
                                                                touched,
                                                                'companyInformation.state',
                                                            )
                                                        }
                                                        errorMessage={getIn(
                                                            errors,
                                                            'companyInformation.state',
                                                        )}
                                                    >
                                                        <Field
                                                            type="text"
                                                            autoComplete="off"
                                                            name="companyInformation.state"
                                                            placeholder="State"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                    <FormItem
                                                        label="Zip Code"
                                                        invalid={
                                                            getIn(
                                                                errors,
                                                                'companyInformation.zipCode',
                                                            ) &&
                                                            getIn(
                                                                touched,
                                                                'companyInformation.zipCode',
                                                            )
                                                        }
                                                        errorMessage={getIn(
                                                            errors,
                                                            'companyInformation.zipCode',
                                                        )}
                                                    >
                                                        <Field
                                                            type="text"
                                                            autoComplete="off"
                                                            name="companyInformation.zipCode"
                                                            placeholder="Zip Code"
                                                            component={Input}
                                                        />
                                                    </FormItem>
                                                </div>
                                            </div>
                                        )}
                                    <div className="md:grid grid-cols-2 gap-4">
                                        <FormItem
                                            label="Annual Income"
                                            invalid={
                                                errors.annualIncome &&
                                                touched.annualIncome
                                            }
                                            errorMessage={errors.annualIncome}
                                        >
                                            <Field name="annualIncome">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <Select
                                                        placeholder="Annual Income"
                                                        field={field}
                                                        form={form}
                                                        options={
                                                            annualIncomeOptions
                                                        }
                                                        value={annualIncomeOptions.filter(
                                                            (status) =>
                                                                status.value ===
                                                                values.annualIncome,
                                                        )}
                                                        onChange={(status) =>
                                                            form.setFieldValue(
                                                                field.name,
                                                                status?.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                        <FormItem
                                            label="Source of Wealth"
                                            invalid={
                                                errors.sourceOfWealth &&
                                                touched.sourceOfWealth
                                            }
                                            errorMessage={errors.sourceOfWealth}
                                        >
                                            <Field name="sourceOfWealth">
                                                {({
                                                    field,
                                                    form,
                                                }: FieldProps) => (
                                                    <Select
                                                        placeholder="Source of Wealth"
                                                        field={field}
                                                        form={form}
                                                        options={
                                                            sourceOfWealthOptions
                                                        }
                                                        value={sourceOfWealthOptions.filter(
                                                            (status) =>
                                                                status.value ===
                                                                values.sourceOfWealth,
                                                        )}
                                                        onChange={(status) =>
                                                            form.setFieldValue(
                                                                field.name,
                                                                status?.value,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        </FormItem>
                                    </div>
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

export default FinancialInformation
