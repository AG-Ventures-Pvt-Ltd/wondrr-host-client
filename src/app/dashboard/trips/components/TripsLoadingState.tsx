import { Loader2 } from 'lucide-react'

const TripsLoadingState = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-subtext">Loading trips...</p>
            </div>
        </div>
    )
}

export default TripsLoadingState
