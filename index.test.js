import { processTop25Bgm } from '.';

describe('stats', () => {
  test('should match expected output format', () => {
    const response = {
      rows: [
        {
          dimensionValues: [
            {
              value: 'customEvent1',
            },
            { value: 'key1' },
          ],
          metricValues: [{ value: '10' }],
        },
        {
          dimensionValues: [
            {
              value: 'customEvent1',
            },
            { value: 'key2' },
          ],
          metricValues: [{ value: '3' }],
        },
        {
          dimensionValues: [
            {
              value: 'customEvent2',
            },
            { value: 'key1' },
          ],
          metricValues: [{ value: '6' }],
        },
        {
          dimensionValues: [
            {
              value: 'customEvent1',
            },
            { value: 'key3' },
          ],
          metricValues: [{ value: '9' }],
        },
        {
          dimensionValues: [
            {
              value: 'customEvent3',
            },
            { value: 'key2' },
          ],
          metricValues: [{ value: '35' }],
        },
        {
          dimensionValues: [
            {
              value: 'customEvent4',
            },
            { value: 'key4' },
          ],
          metricValues: [{ value: '8' }],
        },
        {
          dimensionValues: [
            {
              value: 'customEvent1',
            },
            { value: 'key3' },
          ],
          metricValues: [{ value: '30' }],
        },
      ],
    };
    const result = processTop25Bgm(response);
    expect(result.data).toEqual([
      { track: 'key3', count: 39 },
      { track: 'key2', count: 38 },
      { track: 'key1', count: 16 },
      { track: 'key4', count: 8 },
    ]);
  });
});
