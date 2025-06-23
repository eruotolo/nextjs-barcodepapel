import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function TeamsPage() {
    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-1">
                    <div className="bg-muted/50 col-span-1 rounded-xl p-6 md:col-span-2">
                        <h1>Hola</h1>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
