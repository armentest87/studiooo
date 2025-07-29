
'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const creds = localStorage.getItem('jira_credentials');
    if (creds) {
        redirect('/data-fetcher');
    } else {
        redirect('/login');
    }
  }, []);

  return null;
}
