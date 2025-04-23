import Button from '@/components/ui/Button'
import RecentAcivity, {
    RecentAcivityProps,
} from '@/views/crypto/Portfolio/components/RecentAcivity'
import { useNavigate } from 'react-router-dom'

type RecentActivitiesProps = RecentAcivityProps

const RecentActivities = (props: RecentActivitiesProps) => {
    const navigate = useNavigate()

    const handleClick = () => {
        navigate('/app/crypto/wallets')
    }

    return (
        <RecentAcivity
            title="Recent Activities"
            extra={
                <Button size="sm" onClick={handleClick}>
                    Details
                </Button>
            }
            {...props}
        />
    )
}

export default RecentActivities
