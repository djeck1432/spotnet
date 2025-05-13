import Card from '@/components/ui/Card'
import Progress from '@/components/ui/Progress'
import type { Emails } from '../store'

type EmailSentProps = {
    data?: Partial<Emails>
    className?: string
}

const ProgressInfo = ({ precent }: { precent?: number }) => {
    return (
        <div>
            <h3 className="font-bold">{precent}%</h3>
            <p>Opened</p>
        </div>
    )
}

const EmailSent = ({ data = {}, className }: EmailSentProps) => {
    return (
        <Card className={className}>
            <h4>Email Sent</h4>
            <div className="mt-6">
                <Progress
                    variant="circle"
                    percent={data.precent}
                    width={200}
                    className="flex justify-center"
                    strokeWidth={4}
                    customInfo={<ProgressInfo precent={data.precent} />}
                />
            </div>
            <div className="text-center mt-6">
                <p className="font-semibold">Performace</p>
                <h4 className="font-bold">Average</h4>
            </div>
        </Card>
    )
}

export default EmailSent
