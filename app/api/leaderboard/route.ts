import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function fetchMemberStats(name: string, apiKey: string) {
  const authHeader = `Basic ${Buffer.from(apiKey).toString('base64')}`;
  
  try {
    const [weeklyRes, todayRes] = await Promise.all([
      fetch('https://wakatime.com/api/v1/users/current/stats/last_7_days', {
        headers: { Authorization: authHeader },
      }),
      fetch('https://wakatime.com/api/v1/users/current/summaries?start=today&end=today', {
        headers: { Authorization: authHeader },
      }),
    ]);

    if (!weeklyRes.ok || !todayRes.ok) {
      console.error(`Failed to fetch for ${name}`);
      return null;
    }

    const weeklyData = await weeklyRes.json();
    const todayData = await todayRes.json();

    const weeklyHours = weeklyData?.data?.total_seconds / 3600 || 0;
    const dailyAvg = weeklyData?.data?.daily_average / 3600 || 0;
    const topLanguage = weeklyData?.data?.languages?.[0]?.name || 'N/A';
    
    // Calculate today's hours from summaries
    let todayHours = 0;
    if (todayData?.data?.[0]?.total_seconds) {
        todayHours = todayData.data[0].total_seconds / 3600;
    }

    return {
      name,
      todayHours,
      weeklyHours,
      dailyAvg,
      languages: weeklyData?.data?.languages?.slice(0, 3).map((l: any) => l.name) || [],
    };
  } catch (err) {
    console.error(`Error fetching for ${name}: `, err);
    return null;
  }
}

export async function GET() {
  const members = [];
  
  for (const key of Object.keys(process.env)) {
    if (key.startsWith('WAKATIME_MEMBER_')) {
      const value = process.env[key];
      if (value) {
        const separatorIndex = value.indexOf(':');
        if (separatorIndex > 0) {
          const name = value.slice(0, separatorIndex);
          const apiKey = value.slice(separatorIndex + 1);
          if (name && apiKey) {
            members.push({ name, apiKey });
          }
        }
      }
    }
  }

  const results = await Promise.all(
    members.map((m) => fetchMemberStats(m.name, m.apiKey))
  );

  const filteredResults = results.filter((r) => r !== null);
  
  // Default sort by weekly hours
  filteredResults.sort((a, b) => b!.weeklyHours - a!.weeklyHours);

  return NextResponse.json({ data: filteredResults });
}
