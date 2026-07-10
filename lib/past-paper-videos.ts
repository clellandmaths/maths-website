// Past Paper Video IDs
// Each past paper walkthrough is one YouTube video per paper.
// Extracted from questions[0].videoId in each past paper data file.

export interface PaperVideo {
  year: number | string; // Higher Apps has a "Specimen" paper
  paperNumber: number;
  videoId: string; // '' = no walkthrough video (AH 2016–2021 — markschemes instead)
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

// Generated from the AH data files — 2016–2021 have no videos (markschemes instead)
export const ahPaperVideos: PaperVideo[] = [
  { year: 2025, paperNumber: 1, videoId: 'gxLiBmE_TqM', questionCount: 8 },
  { year: 2025, paperNumber: 2, videoId: 'SoqgtES7sRA', questionCount: 18 },
  { year: 2024, paperNumber: 1, videoId: 'zPqCso-_dBg', questionCount: 8 },
  { year: 2024, paperNumber: 2, videoId: 'glLpgi1-Mxc', questionCount: 15 },
  { year: 2023, paperNumber: 1, videoId: 'TIoIgzV5tjU', questionCount: 9 },
  { year: 2023, paperNumber: 2, videoId: 'l5hreoPcQZQ', questionCount: 15 },
  { year: 2022, paperNumber: 1, videoId: 'h4S_1o19d4c', questionCount: 8 },
  { year: 2022, paperNumber: 2, videoId: 'uYs7eC7VBfI', questionCount: 13 },
  { year: 2021, paperNumber: 1, videoId: '', questionCount: 9 },
  { year: 2021, paperNumber: 2, videoId: '', questionCount: 14 },
  { year: 2019, paperNumber: 1, videoId: '', questionCount: 20 },
  { year: 2018, paperNumber: 1, videoId: '', questionCount: 19 },
  { year: 2017, paperNumber: 1, videoId: '', questionCount: 18 },
  { year: 2016, paperNumber: 1, videoId: '', questionCount: 18 },
];

export const higherAppsPaperVideos: PaperVideo[] = [
  { year: 2025, paperNumber: 1, videoId: 'CPtCgqgoab0', questionCount: 12 },
  { year: 2024, paperNumber: 1, videoId: 'tpAnZSEkKgU', questionCount: 10 },
  { year: 2023, paperNumber: 1, videoId: 'sjQYsyPN6Ds', questionCount: 11 },
  { year: 2022, paperNumber: 1, videoId: 'NPRdKZ-fHI8', questionCount: 10 },
  { year: 'Specimen', paperNumber: 1, videoId: 'kKov4ahinrE', questionCount: 11 },
];

export const n5AppsPaperVideos: PaperVideo[] = [
  { year: 2025, paperNumber: 1, videoId: 'TymgQ-X3W28', questionCount: 11 },
  { year: 2025, paperNumber: 2, videoId: 'v95kOj4eiLI', questionCount: 18 },
  { year: 2024, paperNumber: 1, videoId: 'XADVJKvGWAs', questionCount: 11 },
  { year: 2024, paperNumber: 2, videoId: 'JsNGpP8r8yw', questionCount: 17 },
  { year: 2023, paperNumber: 1, videoId: 'uAeeg34cHMI', questionCount: 13 },
  { year: 2023, paperNumber: 2, videoId: 'gLNBAw0aYa4', questionCount: 16 },
  { year: 2022, paperNumber: 1, videoId: 'Oy6jRyD_kUk', questionCount: 12 },
  { year: 2022, paperNumber: 2, videoId: 'Qnv3fhpxQyY', questionCount: 18 },
  { year: 2021, paperNumber: 1, videoId: '7nyls6gLz5U', questionCount: 16 },
  { year: 2021, paperNumber: 2, videoId: 'U38RdhYGx7w', questionCount: 17 },
  { year: 2019, paperNumber: 1, videoId: 'ywr8aMJspYo', questionCount: 15 },
  { year: 2019, paperNumber: 2, videoId: 'njONA7uuPvw', questionCount: 18 },
  { year: 2018, paperNumber: 1, videoId: 'lHjwJFKx3ko', questionCount: 15 },
  { year: 2018, paperNumber: 2, videoId: 'wR64HEQ-iuQ', questionCount: 18 },
];
