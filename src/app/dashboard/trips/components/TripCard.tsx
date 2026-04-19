import { Dot, Folder, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Card from '@/common/components/composites/Card'
import MyImage from '@/common/components/atoms/Image'
import { Toggle } from '@/common/ui/toggle'
import { cn } from '@/common/ui/utils'
import { TripList } from '../types'

interface TripCardProps {
    trip: TripList
    onStatusToggle: (trip: { id: string; name: string; status: string }, targetStatus: string) => void
    isUpdating: boolean
}

const TripCard = ({ trip, onStatusToggle, isUpdating }: TripCardProps) => {
    const router = useRouter()

    return (
        <Card
            key={trip.id}
            className="cursor-pointer overflow-hidden p-0!"
            onClick={() => router.push(`/dashboard/trips/${trip.slug}`)}
        >
            <div className="relative w-full h-52 bg-gray-100">
                {trip.image ? (
                    <MyImage
                        src={trip.image}
                        alt={trip.slug}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Folder className="w-16 h-16 text-gray-300" />
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col gap-2 mb-2">
                <h3 className="text-maintext font-medium text-lg">{trip.name}</h3>
                {trip.location && (
                    <div className="flex items-center gap-1 text-subtext text-sm">
                        <MapPin size={14} />
                        <span>{trip.location}</span>
                    </div>
                )}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8 text-sm">
                        <div className="flex items-center">
                            <Dot size={16} strokeWidth={9} className="text-success p-0! m-0!" />
                            <span className="text-subtext">
                                {trip.upcomingBatches} upcoming
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Dot size={16} strokeWidth={9} className="text-subtext" />
                            <span className="text-subtext">
                                {trip.completedBatches} completed
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className={cn(
                                "p-1 rounded-lg transition-colors",
                                trip.status === 'in_review' && "bg-yellow-100"
                            )}>
                                <Toggle
                                    checked={trip.status === 'in_review' || trip.status === 'published'}
                                    onCheckedChange={(checked) => {
                                        const currentStatus = trip.status || 'draft'
                                        let targetStatus = 'draft'
                                        
                                        if (checked) {
                                            // When toggling on, go to in_review (hosts apply for review)
                                            targetStatus = 'in_review'
                                        } else {
                                            // When toggling off, go back to draft
                                            targetStatus = 'draft'
                                        }
                                        
                                        onStatusToggle(
                                            { id: trip.id, name: trip.name, status: currentStatus },
                                            targetStatus
                                        )
                                    }}
                                    checkedLabel={
                                        trip.status === 'published' ? 'Published' : 
                                        trip.status === 'in_review' ? 'In Review' : 
                                        'Apply for Review'
                                    }
                                    uncheckedLabel="Draft"
                                    size="sm"
                                    disabled={isUpdating || trip.status === 'published'}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default TripCard
