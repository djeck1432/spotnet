import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import RichTextEditor from '@/components/shared/RichTextEditor'
import { Field, Form, Formik } from 'formik'
import { useAppSelector } from '../store'
import { apiPostArticle } from '@/services/KnowledgeBaseService'
import { useNavigate } from 'react-router-dom'
import ReactHtmlParser from 'html-react-parser'
import * as Yup from 'yup'
import type { FieldProps } from 'formik'

type FormModel = {
    title: string
    content: string
    category: string
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title required'),
    category: Yup.string().required('Category required'),
    content: Yup.string().required('Content required'),
})

const demoText =
    '<p>Kopi-luwak, seasonal breve strong caffeine medium lungo grinder. Espresso filter, café au lait turkish, sweet, single shot half and half americano variety mocha extraction. Skinny to go, a brewed, mocha single origin, plunger pot cup strong white dripper. Single origin pumpkin spice, instant, cultivar americano crema aromatic bar café au lait.</p><p>Acerbic frappuccino acerbic, flavour, in carajillo bar percolator aroma trifecta half and half et extraction barista, coffee affogato organic est latte wings breve lungo. Percolator, caramelization, foam organic, coffee frappuccino ristretto chicory seasonal cappuccino steamed grinder half and half foam mazagran fair trade, foam carajillo a in carajillo. Spoon medium ristretto irish dripper steamed, single shot, viennese, sit filter, flavour java cinnamon breve milk irish americano. Java doppio con panna, aged qui trifecta redeye beans, coffee trifecta dripper, bar variety saucer, a instant grinder wings flavour. Froth filter instant strong grinder saucer medium id that medium blue mountain, in, extra , aged lungo siphon, instant, strong, dripper siphon affogato seasonal mocha. Coffee qui so eu mocha decaffeinated, organic mazagran affogato, as seasonal kopi-luwak doppio con panna.</p><p>Roast, breve, french press extraction and acerbic, con panna, cup skinny doppio aroma seasonal. Strong, coffee, milk, caffeine aftertaste body mazagran pumpkin spice irish affogato.</p><p>Est java mug milk a cortado saucer so aroma con panna froth sweet con panna. Dripper single origin turkish shop in as froth black robusta doppio so roast medium cortado, variety con panna, barista carajillo café au lait so cortado pumpkin spice. Cappuccino qui organic doppio trifecta redeye rich, viennese, dark eu at as sit caramelization as, cortado to go bar mug coffee macchiato iced whipped. Siphon a breve chicory, dark, chicory, barista cup froth, caramelization whipped, caramelization siphon crema sugar, doppio cream turkish siphon a americano rich. Bar , macchiato roast, seasonal lungo milk, robusta, white milk, cup to go, flavour, spoon siphon est, froth, french press so, kopi-luwak mug foam sit sweet. Foam, caramelization dark cortado, brewed pumpkin spice turkish frappuccino single origin body turkish, macchiato, espresso variety macchiato, froth seasonal, crema robust con panna decaffeinated turkish organic medium. Barista et extraction, so organic aftertaste beans at, grounds as iced cinnamon, aged, spoon fair trade so shop mazagran.</p><p>Cappuccino, percolator latte viennese as, caffeine, sweet, a and, affogato, beans spoon and crema, body, to go sit chicory coffee robust dark. Et, to go java filter doppio single shot cup qui kopi-luwak, arabica aftertaste café au lait grounds arabica at medium americano iced siphon as saucer organic barista. Spoon aromatic latte filter, mazagran percolator siphon kopi-luwak, grounds at kopi-luwak frappuccino mazagran beans strong french press brewed. </p><p> Americano wings grinder variety id irish aftertaste iced, doppio mazagran, instant irish robust percolator sit foam latte viennese milk. Doppio chicory grounds to go steamed skinny mocha aged, robust skinny caramelization trifecta plunger pot single origin. Sweet cup cappuccino viennese lungo, spoon java white aftertaste frappuccino spoon froth fair trade flavour affogato pumpkin spice. Bar caffeine froth, coffee cinnamon coffee, in pumpkin spice, espresso, carajillo espresso seasonal café au lait sit carajillo. Extra skinny, wings dripper, froth plunger pot rich variety, single shot siphon frappuccino rich, and shop skinny cinnamon filter, grounds seasonal cup decaffeinated foam. Eu, rich arabica irish instant, lungo half and half seasonal, bar siphon cup espresso caramelization. </p>'

const Editor = ({ mode }: { mode: string }) => {
    const navigate = useNavigate()

    const article = useAppSelector(
        (state) => state.knowledgeBaseEditArticle.data.article,
    )
    const categoryLabel = useAppSelector(
        (state) => state.knowledgeBaseEditArticle.data.categoryLabel,
    )
    const categoryValue = useAppSelector(
        (state) => state.knowledgeBaseEditArticle.data.categoryValue,
    )

    const [categoryList, setCategoryList] = useState([
        { label: 'Survey', value: 'survey' },
        { label: 'Themes', value: 'themes' },
        { label: 'Security', value: 'security' },
        { label: 'Integration', value: 'integration' },
        { label: 'Media', value: 'media' },
        { label: 'Analytic', value: 'analytic' },
        { label: 'Chatbot', value: 'chatbot' },
        { label: 'Commission', value: 'commission' },
    ])

    const onComplete = async (
        value: FormModel,
        setSubmitting: (isSubmitting: boolean) => void,
    ) => {
        setSubmitting(true)
        const newData = { ...article, ...value, categoryLabel }
        const resp = await apiPostArticle(newData)
        setSubmitting(false)
        if (resp.data) {
            toast.push(
                <Notification
                    title={`Successfully ${mode} article`}
                    type="success"
                />,
                {
                    placement: 'top-center',
                },
            )
            navigate('/app/knowledge-base/manage-articles')
        }
    }

    useEffect(() => {
        if (categoryLabel && categoryValue) {
            setCategoryList((prev) => [
                ...prev,
                { label: categoryLabel, value: categoryValue },
            ])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryLabel, categoryValue])

    return (
        <Formik
            enableReinitialize
            initialValues={{
                title: article.title ? article.title : '',
                content: article.content ? article.content + demoText : '',
                category: categoryValue,
            }}
            validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
                onComplete(values, setSubmitting)
            }}
        >
            {({ values, touched, errors, isSubmitting }) => (
                <Form>
                    {mode === 'preview' ? (
                        <div className="mt-6">
                            <h4 className="mb-4">{values.title}</h4>
                            <div className="prose dark:prose-invert max-w-none">
                                {ReactHtmlParser(values.content || '')}
                            </div>
                        </div>
                    ) : (
                        <FormContainer>
                            <FormItem
                                label="Title"
                                invalid={errors.title && touched.title}
                                errorMessage={errors.title}
                            >
                                <Field
                                    autoComplete="off"
                                    name="title"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Category"
                                invalid={errors.category && touched.category}
                                errorMessage={errors.category}
                            >
                                <Field name="category">
                                    {({ field, form }: FieldProps) => (
                                        <Select
                                            placeholder="Category"
                                            field={field}
                                            form={form}
                                            options={categoryList}
                                            value={categoryList.filter(
                                                (category) =>
                                                    category.value ===
                                                    values.category,
                                            )}
                                            onChange={(category) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    category?.value,
                                                )
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <FormItem
                                label="Content"
                                className="mb-0"
                                labelClass="!justify-start"
                                invalid={errors.content && touched.content}
                                errorMessage={errors.content}
                            >
                                <Field name="content">
                                    {({ field, form }: FieldProps) => (
                                        <RichTextEditor
                                            value={field.value}
                                            onChange={(val) =>
                                                form.setFieldValue(
                                                    field.name,
                                                    val,
                                                )
                                            }
                                        />
                                    )}
                                </Field>
                            </FormItem>
                            <div className="mt-4 flex justify-end">
                                <Button loading={isSubmitting} variant="solid">
                                    Submit
                                </Button>
                            </div>
                        </FormContainer>
                    )}
                </Form>
            )}
        </Formik>
    )
}

export default Editor
