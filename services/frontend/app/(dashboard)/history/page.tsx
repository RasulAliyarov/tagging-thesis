import { cookies } from 'next/headers';
import HistoryClient from './HistoryClient';

async function getHistory() {
    const cookieStore = await cookies(); 
    const token = cookieStore.get('token')?.value;

    if (!token) return null; 

    // Now we fetch from the internal Docker network
    const res = await fetch(`${process.env.INTERNAL_API_URL}/api/analyze/history`, {
        headers: {
            'Authorization': `Bearer ${token}`, 
        },
        cache: 'no-store',
    });

    if (!res.ok) return null;
    return res.json();
}

export default async function HistoryPage() {
    const histories = await getHistory();

    if (!histories) {
        // Redirect or show login state if SSR fetch fails
        return <div>Please log in to view history.</div>;
    }

    return <HistoryClient initialHistories={histories} />;
}