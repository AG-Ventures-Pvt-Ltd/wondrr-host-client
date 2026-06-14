import { Dot, Folder, MapPin, Trash2 } from 'lucide-react'
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
    onDelete: (trip: { slug: string; name: string }) => void
}

const TripCard = ({ trip, onStatusToggle, isUpdating, onDelete }: TripCardProps) => {
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
                            <button
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                onClick={() => onDelete({ slug: trip.slug, name: trip.name })}
                                title="Delete trip"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <div className={cn(
                                "p-1 rounded-lg transition-colors",
                                trip.status === 'in_review' && "bg-yellow-100",
                                trip.status === 'published' && "bg-green-100",
                                trip.status === 'archived' && "bg-gray-100"
                            )}>
                                <Toggle
                                    checked={trip.status === 'published' || trip.status === 'in_review'}
                                    onCheckedChange={(checked) => {
                                        const currentStatus = trip.status || 'draft'
                                        let targetStatus = 'draft'
                                        
                                        if (currentStatus === 'draft' || currentStatus === 'in_review') {
                                            if (checked) {
                                                targetStatus = 'in_review'
                                            } else {
                                                targetStatus = 'draft'
                                            }
                                        } else if (currentStatus === 'published') {
                                            if (checked) {
                                                // Stay published or no change
                                                return
                                            } else {
                                                targetStatus = 'archived'
                                            }
                                        } else if (currentStatus === 'archived') {
                                            if (checked) {
                                                targetStatus = 'published'
                                            } else {
                                                // Stay archived or no change
                                                return
                                            }
                                        }
                                        
                                        onStatusToggle(
                                            { id: trip.id, name: trip.name, status: currentStatus },
                                            targetStatus
                                        )
                                    }}
                                    checkedLabel={
                                        (trip.status === 'published' || trip.status === 'archived') ? 'Published' : 'In Review'
                                    }
                                    uncheckedLabel={
                                        (trip.status === 'published' || trip.status === 'archived') ? 'Archived' : 'Draft'
                                    }
                                    size="sm"
                                    disabled={isUpdating}
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
