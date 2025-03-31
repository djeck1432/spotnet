import { useEffect } from 'react'

import Loading from '@/components/shared/Loading'
import UsersAvatarGroup from '@/components/shared/UsersAvatarGroup'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'
import ArticleAction from './ArticleAction'
import { getArticle, useAppDispatch, useAppSelector } from '../store'
import ReactHtmlParser from 'html-react-parser'
import { useLocation } from 'react-router-dom'

const ArticleContent = ({ articleId }: { articleId?: string }) => {
    const dispatch = useAppDispatch()

    const article = useAppSelector(
        (state) => state.knowledgeBaseArticle.data.article,
    )
    const loading = useAppSelector(
        (state) => state.knowledgeBaseArticle.data.loading,
    )

    const { search } = useLocation()

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const fetchData = () => {
        if (articleId) {
            dispatch(getArticle({ id: articleId }))
        }
    }

    return (
        <Loading
            loading={loading}
            customLoader={
                <div className="flex flex-col gap-8">
                    <MediaSkeleton />
                    <TextBlockSkeleton rowCount={6} />
                    <TextBlockSkeleton rowCount={4} />
                    <TextBlockSkeleton rowCount={8} />
                </div>
            }
        >
            <h3>{article.title}</h3>
            <div className="flex items-center mt-4 gap-4">
                <UsersAvatarGroup
                    avatarProps={{ size: 40 }}
                    users={article.authors || []}
                />
                <div className="text-xs">
                    <div className="mb-1">
                        Created by:
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            {article.createdBy}
                        </span>
                    </div>
                    <div>
                        <span>Last updated: {article.updateTime}</span>
                        <span className="mx-2">•</span>
                        <span>{article.timeToRead} min read</span>
                        <span className="mx-2">•</span>
                        <span>{article.viewCount} viewed</span>
                    </div>
                </div>
            </div>
            <div className="mt-8 prose dark:prose-invert max-w-none">
                <p>{ReactHtmlParser(article.content || '')}</p>
                {/* static display text to be remove */}
                <p>
                    Kopi-luwak, seasonal breve strong caffeine medium lungo
                    grinder. Espresso filter, café au lait turkish, sweet,
                    single shot half and half americano variety mocha
                    extraction. Skinny to go, a brewed, mocha single origin,
                    plunger pot cup strong white dripper. Single origin pumpkin
                    spice, instant, cultivar americano crema aromatic bar café
                    au lait.
                </p>
                <p>
                    Acerbic frappuccino acerbic, flavour, in carajillo bar
                    percolator aroma trifecta half and half et extraction
                    barista, coffee affogato organic est latte wings breve
                    lungo. Percolator, caramelization, foam organic, coffee
                    frappuccino ristretto chicory seasonal cappuccino steamed
                    grinder half and half foam mazagran fair trade, foam
                    carajillo a in carajillo. Spoon medium ristretto irish
                    dripper steamed, single shot, viennese, sit filter, flavour
                    java cinnamon breve milk irish americano. Java doppio con
                    panna, aged qui trifecta redeye beans, coffee trifecta
                    dripper, bar variety saucer, a instant grinder wings
                    flavour. Froth filter instant strong grinder saucer medium
                    id that medium blue mountain, in, extra , aged lungo siphon,
                    instant, strong, dripper siphon affogato seasonal mocha.
                    Coffee qui so eu mocha decaffeinated, organic mazagran
                    affogato, as seasonal kopi-luwak doppio con panna.
                </p>
                <p>
                    Roast, breve, french press extraction and acerbic, con
                    panna, cup skinny doppio aroma seasonal. Strong, coffee,
                    milk, caffeine aftertaste body mazagran pumpkin spice irish
                    affogato.
                </p>
                <p>
                    Est java mug milk a cortado saucer so aroma con panna froth
                    sweet con panna. Dripper single origin turkish shop in as
                    froth black robusta doppio so roast medium cortado, variety
                    con panna, barista carajillo café au lait so cortado pumpkin
                    spice. Cappuccino qui organic doppio trifecta redeye rich,
                    viennese, dark eu at as sit caramelization as, cortado to go
                    bar mug coffee macchiato iced whipped. Siphon a breve
                    chicory, dark, chicory, barista cup froth, caramelization
                    whipped, caramelization siphon crema sugar, doppio cream
                    turkish siphon a americano rich. Bar , macchiato roast,
                    seasonal lungo milk, robusta, white milk, cup to go,
                    flavour, spoon siphon est, froth, french press so,
                    kopi-luwak mug foam sit sweet. Foam, caramelization dark
                    cortado, brewed pumpkin spice turkish frappuccino single
                    origin body turkish, macchiato, espresso variety macchiato,
                    froth seasonal, crema robust con panna decaffeinated turkish
                    organic medium. Barista et extraction, so organic aftertaste
                    beans at, grounds as iced cinnamon, aged, spoon fair trade
                    so shop mazagran.
                </p>
                <p>
                    Cappuccino, percolator latte viennese as, caffeine, sweet, a
                    and, affogato, beans spoon and crema, body, to go sit
                    chicory coffee robust dark. Et, to go java filter doppio
                    single shot cup qui kopi-luwak, arabica aftertaste café au
                    lait grounds arabica at medium americano iced siphon as
                    saucer organic barista. Spoon aromatic latte filter,
                    mazagran percolator siphon kopi-luwak, grounds at kopi-luwak
                    frappuccino mazagran beans strong french press brewed.{' '}
                </p>
                <p>
                    {' '}
                    Americano wings grinder variety id irish aftertaste iced,
                    doppio mazagran, instant irish robust percolator sit foam
                    latte viennese milk. Doppio chicory grounds to go steamed
                    skinny mocha aged, robust skinny caramelization trifecta
                    plunger pot single origin. Sweet cup cappuccino viennese
                    lungo, spoon java white aftertaste frappuccino spoon froth
                    fair trade flavour affogato pumpkin spice. Bar caffeine
                    froth, coffee cinnamon coffee, in pumpkin spice, espresso,
                    carajillo espresso seasonal café au lait sit carajillo.
                    Extra skinny, wings dripper, froth plunger pot rich variety,
                    single shot siphon frappuccino rich, and shop skinny
                    cinnamon filter, grounds seasonal cup decaffeinated foam.
                    Eu, rich arabica irish instant, lungo half and half
                    seasonal, bar siphon cup espresso caramelization.{' '}
                </p>
            </div>
            <ArticleAction />
        </Loading>
    )
}

export default ArticleContent
