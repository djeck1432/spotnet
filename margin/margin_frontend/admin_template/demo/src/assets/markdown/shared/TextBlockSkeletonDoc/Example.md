```jsx
import { useState } from 'react'
import Switcher from '@/components/ui/Switcher'
import TextBlockSkeleton from '@/components/shared/loaders/TextBlockSkeleton'

const Example = () => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <>
            <div className="flex items-center mb-6 gap-2">
                <span>Loading State: </span>
                <Switcher
                    checked={isLoading}
                    onChange={(checked) => setIsLoading(!checked)}
                />
            </div>
            <div className="prose">
                {isLoading ? (
                    <TextBlockSkeleton rowCount={4} />
                ) : (
                    <>
                        <h4>Wall of text</h4>
                        <p>
                            Kopi-luwak, seasonal breve strong caffeine medium
                            lungo grinder. Espresso filter, café au lait
                            turkish, sweet, single shot half and half americano
                            variety mocha extraction. Skinny to go, a brewed,
                            mocha single origin, plunger pot cup strong white
                            dripper. Single origin pumpkin spice, instant,
                            cultivar americano crema aromatic bar café au lait.
                        </p>
                    </>
                )}
            </div>
        </>
    )
}

export default Example
```
