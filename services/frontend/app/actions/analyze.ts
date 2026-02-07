'use server';

import { cookies } from 'next/headers';

export async function analyzeSentence(text: string) {
     const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const res = await fetch(
    `${process.env.INTERNAL_API_URL}/api/analyze`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Analyze failed');
  }

  return res.json();
}


export async function batchAnalyze(formData: FormData) {
const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value

        if (!token) {
    throw new Error('Unauthorized');
  }

  const res = await fetch(
    `${process.env.INTERNAL_API_URL}/api/analyze/batch-analyze`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, 
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.json();
}