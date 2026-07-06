// Past Paper Video IDs
// Each past paper walkthrough is one YouTube video per paper.
// Extracted from questions[0].videoId in each past paper data file.

export interface PaperVideo {
  year: number;
  paperNumber: number;
  videoId: string;
  questionCount: number;
}

export const n5PaperVideos: PaperVideo[] = [
  { year: 2025, paperNumber: 1, videoId: '1QY10VDwJ6s', questionCount: 15 },
  { year: 2025, paperNumber: 2, videoId: '0kEd8lvqwMQ', questionCount: 15 },
  { year: 2024, paperNumber: 1, videoId: 'DL-cJTghJVw', questionCount: 14 },
  { year: 2024, paperNumber: 2, videoId: 'zGQ9vkMS91A', questionCount: 16 },
  { year: 2023, paperNumber: 1, videoId: 'N9_IJSsn3y8', questionCount: 14 },
  { year: 2023, paperNumber: 2, videoId: 'wBABvZztps0', questionCount: 15 },
  { year: 2022, paperNumber: 1, videoId: 'KS2EpwO4xfI', questionCount: 15 },
  { year: 2022, paperNumber: 2, videoId: 'dFdKdzadNUE', questionCount: 14 },
  { year: 2019, paperNumber: 1, videoId: '0ZcNrPB1w3s', questionCount: 15 },
  { year: 2019, paperNumber: 2, videoId: 'mH8kVu6QMjU', questionCount: 18 },
  { year: 2018, paperNumber: 1, videoId: 'zXipM1YMziU', questionCount: 19 },
  { year: 2018, paperNumber: 2, videoId: 'pV_mPS5bNG0', questionCount: 18 },
  { year: 2017, paperNumber: 1, videoId: 'RgoTxLmU1Pc', questionCount: 15 },
  { year: 2017, paperNumber: 2, videoId: 'ikwN7yZqPE8', questionCount: 15 },
  { year: 2016, paperNumber: 1, videoId: 'nueOyweHSas', questionCount: 12 },
  { year: 2016, paperNumber: 2, videoId: 'aYZJzX_drX4', questionCount: 16 },
  { year: 2015, paperNumber: 1, videoId: 'TKdgtBFRXJY', questionCount: 14 },
  { year: 2015, paperNumber: 2, videoId: '3qKFGh3k8ok', questionCount: 14 },
  { year: 2014, paperNumber: 1, videoId: 'mwZNKXHvY5U', questionCount: 13 },
  { year: 2014, paperNumber: 2, videoId: 's4Fu-SgBgV8', questionCount: 13 },
];

export const higherPaperVideos: PaperVideo[] = [
  { year: 2025, paperNumber: 1, videoId: 't1_htB2awtg', questionCount: 13 },
  { year: 2025, paperNumber: 2, videoId: 'NNOugVXypYo', questionCount: 14 },
  { year: 2024, paperNumber: 1, videoId: 'Vkp2t9gy3DA', questionCount: 13 },
  { year: 2024, paperNumber: 2, videoId: 'rhI1Qw2DjkE', questionCount: 13 },
  { year: 2023, paperNumber: 1, videoId: 'uHHQrgtXh7w', questionCount: 13 },
  { year: 2023, paperNumber: 2, videoId: 'nbwGH7tXPm8', questionCount: 15 },
  { year: 2022, paperNumber: 1, videoId: '-McipY5Dx0I', questionCount: 14 },
  { year: 2022, paperNumber: 2, videoId: '55pxnGty5co', questionCount: 10 },
  { year: 2019, paperNumber: 1, videoId: 'I8WkRoWL8as', questionCount: 17 },
  { year: 2019, paperNumber: 2, videoId: 'Enrov8kIzeQ', questionCount: 15 },
  { year: 2018, paperNumber: 1, videoId: 'anlLalFtifo', questionCount: 15 },
  { year: 2018, paperNumber: 2, videoId: 'iRtP334DDMs', questionCount: 12 },
  { year: 2017, paperNumber: 1, videoId: '-2Gcx6LHREc', questionCount: 15 },
  { year: 2017, paperNumber: 2, videoId: 'VhgnQl6gh14', questionCount: 11 },
  { year: 2016, paperNumber: 1, videoId: 'lOTDQhyKvRs', questionCount: 15 },
  { year: 2016, paperNumber: 2, videoId: 'CBT_cz_j1Xk', questionCount: 11 },
  { year: 2015, paperNumber: 1, videoId: 'Pmo4iSGoBnk', questionCount: 15 },
  { year: 2015, paperNumber: 2, videoId: 'O9EH6ssn6WY', questionCount: 9 },
];
