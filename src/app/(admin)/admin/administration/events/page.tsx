import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import EventCalendarsTable from '@/components/Tables/Administration/EventCalendars/EventCalendarsTable';

export default function EventsPage() {
    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <div className="bg-muted/50 col-span-1 rounded-xl p-6 md:col-span-2">
                        <EventCalendarsTable />
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
