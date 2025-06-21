import ProtectedRoute from '@/components/Auth/ProtectedRoute';

export default function BlogPage() {
    return (
        <ProtectedRoute>
            <div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="bg-muted/50 col-span-3 rounded-xl p-6 md:col-span-2">
                        <h1>Hola</h1>
                    </div>
                    <div className="bg-muted/50 col-span-3 rounded-xl p-6 md:col-span-1">
                        <h1>Hola</h1>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
