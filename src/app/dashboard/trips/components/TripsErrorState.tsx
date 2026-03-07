import { AlertCircle } from 'lucide-react'
import Button from '@/common/components/atoms/Button'

const TripsErrorState = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
                <p className="text-subtext">Failed to load trips. Please try again.</p>
                <Button onClick={() => window.location.reload()} variant="outlined">
                    Retry
                </Button>
            </div>
        </div>
    )
}

export default TripsErrorState
