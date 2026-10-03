import { writeFileSync } from 'fs';
import { orderBy } from 'lodash-es';
import { formatISO, startOfYesterday, subDays } from 'date-fns';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

if (process.env.NODE_ENV !== 'production') {
  await import('dotenv/config');
}

const propertyId = process.env.GA4_PROPERTY_ID;
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY?.split(String.raw`\n`)?.join('\n'),
  },
});

async function runReport() {
  const [response] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dimensions: [{ name: 'eventName' }, { name: 'customEvent:ce_youtube' }],
    metrics: [{ name: 'eventCount' }],
    dateRanges: [
      {
        startDate: formatISO(subDays(startOfYesterday(), 7), {
          representation: 'date',
        }),
        endDate: formatISO(startOfYesterday(), { representation: 'date' }),
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        inListFilter: {
          values: [
            'ce_complete_queue_video',
            'ce_loop_embedded_video',
            'ce_view_embedded_video',
          ],
        },
      },
    },
    orderBys: [{ metric: { metricName: 'eventCount' } }],
  });

  return processTop25Bgm(response);
}

export function processTop25Bgm(response, n = 25) {
  const bgmMap = new Map();
  response.rows.forEach((row) => {
    const id = row?.dimensionValues?.[1]?.value;
    if (!id) return;
    const count = Number(row?.metricValues?.[0]?.value ?? 0);
    if (bgmMap.has(id)) {
      bgmMap.set(id, bgmMap.get(id) + count);
    } else {
      bgmMap.set(id, count);
    }
  });
  const sorted = orderBy(
    Array.from(bgmMap, ([track, count]) => ({ track, count })),
    'count',
    'desc'
  );
  return { time: formatISO(new Date()), data: sorted.slice(0, n) };
}

export async function main() {
  const result = await runReport();
  writeFileSync('top25.json', JSON.stringify(result));
}
