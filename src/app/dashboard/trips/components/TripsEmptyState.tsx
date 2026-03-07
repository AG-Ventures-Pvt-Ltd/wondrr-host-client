import { Plus, Folder } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Card from '@/common/components/composites/Card'
import Button from '@/common/components/atoms/Button'

const TripsEmptyState = () => {
    const router = useRouter()

    return (
        <Card className="max-w-lg mx-auto flex flex-col items-center py-6 my-[10%] gap-6">
            <div className="flex items-center justify-center w-20 h-20 bg-blue-50 rounded-2xl">
                <Folder className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-base text-neutral-900 font-normal text-center">
                Create Your First Trip
            </h3>
            <p className="text-base text-neutral-600 font-normal text-center px-3">
                Start organizing amazing travel experiences.
                <br />
                Add your first destination, set up batches, and watch bookings roll in.
            </p>
            <Button
                className="bg-blue-600 rounded-2xl text-white shadow-sm"
                onClick={() => router.push('/dashboard/trips/create')}
            >
                <Plus size={16} strokeWidth={2} />
                <span className="ml-2 text-sm">Create Your First Trip</span>
            </Button>
        </Card>
    )
}

export default TripsEmptyState
