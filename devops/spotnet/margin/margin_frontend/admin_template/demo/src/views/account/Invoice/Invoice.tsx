import Container from '@/components/shared/Container'
import InvoiceContent from './components/InvoiceContent'
import Card from '@/components/ui/Card'

const Invoice = () => {
    return (
        <Container className="h-full">
            <Card className="h-full" bodyClass="h-full">
                <InvoiceContent />
            </Card>
        </Container>
    )
}

export default Invoice
