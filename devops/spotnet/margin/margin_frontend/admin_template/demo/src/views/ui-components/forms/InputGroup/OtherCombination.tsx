import InputGroup from '@/components/ui/InputGroup'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { HiOutlineMicrophone } from 'react-icons/hi'

const { Addon } = InputGroup

const options1 = [
    { value: '.com', label: '.com' },
    { value: '.net', label: '.net' },
    { value: '.io', label: '.io' },
]

const options2 = [
    { value: '12.00 AM', label: '12.00 AM' },
    { value: '1.00 AM ', label: '1.00 AM' },
    { value: '2.00 AM ', label: '2.00 AM' },
    { value: '3.00 AM ', label: '3.00 AM' },
    { value: '4.00 AM ', label: '4.00 AM' },
    { value: '5.00 AM ', label: '5.00 AM' },
    { value: '6.00 AM ', label: '6.00 AM' },
    { value: '7.00 AM ', label: '7.00 AM' },
    { value: '8.00 AM ', label: '8.00 AM' },
    { value: '9.00 AM ', label: '9.00 AM' },
    { value: '10.00 AM ', label: '10.00 AM' },
    { value: '11.00 AM ', label: '11.00 AM' },
    { value: '12.00 PM ', label: '12.00 PM' },
    { value: '1.00 PM ', label: '1.00 PM' },
    { value: '2.00 PM ', label: '2.00 PM' },
    { value: '3.00 PM ', label: '3.00 PM' },
    { value: '4.00 PM ', label: '4.00 PM' },
    { value: '5.00 PM ', label: '5.00 PM' },
    { value: '6.00 PM ', label: '6.00 PM' },
    { value: '7.00 PM ', label: '7.00 PM' },
    { value: '8.00 PM ', label: '8.00 PM' },
    { value: '9.00 PM ', label: '9.00 PM' },
    { value: '10.00 PM ', label: '10.00 PM' },
    { value: '11.00 PM ', label: '11.00 PM' },
]

const OtherCombination = () => {
    return (
        <div>
            <InputGroup className="mb-4">
                <Input
                    prefix={
                        <HiOutlineMicrophone className="text-xl text-indigo-600 cursor-pointer" />
                    }
                />
                <Button>Send</Button>
            </InputGroup>
            <InputGroup className="mb-4">
                <DatePicker placeholder="Start Date" />
                <Addon>To</Addon>
                <DatePicker placeholder="End Date" />
            </InputGroup>
            <InputGroup className="mb-4">
                <Input />
                <div style={{ minWidth: 100 }}>
                    <Select
                        isSearchable={false}
                        defaultValue={{ label: '.com', value: '.com' }}
                        options={options1}
                    />
                </div>
            </InputGroup>
            <InputGroup className="mb-4">
                <DatePicker placeholder="Select Date" />
                <div style={{ minWidth: 120 }}>
                    <Select
                        isSearchable={false}
                        placeholder="Time"
                        options={options2}
                    />
                </div>
            </InputGroup>
        </div>
    )
}

export default OtherCombination
