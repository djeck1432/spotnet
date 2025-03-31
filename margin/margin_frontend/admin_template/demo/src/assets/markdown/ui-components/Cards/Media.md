```jsx
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'

const HeaderFooterBorder = () => {
    const cardFooter = (
        <div className="flex items-center">
            <Avatar
                size={30}
                className="mr-2"
                shape="circle"
                src="/img/avatars/thumb-1.jpg"
            />
            <span>
                <h6 className="text-sm">Kristen Fisher</h6>
                <span className="text-xs">Sep 23, 2021</span>
            </span>
        </div>
    )

    const cardHeader = (
        <div className="rounded-tl-lg rounded-tr-lg overflow-hidden">
            <img src="/img/others/img-1.jpg" alt="card header" />
        </div>
    )

    return (
        <div className="max-w-xs">
            <Card
                clickable
                className="hover:shadow-lg transition duration-150 ease-in-out dark:border dark:border-gray-600 dark:border-solid"
                header={cardHeader}
                footer={cardFooter}
                headerClass="p-0"
                footerBorder={false}
                headerBorder={false}
            >
                <span className="text-emerald-600 font-semibold">
                    Life Style
                </span>
                <h4 className="font-bold my-3">Use the modern rules</h4>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the
                    industry&apos;s.
                </p>
            </Card>
        </div>
    )
}

export default HeaderFooterBorder
```
