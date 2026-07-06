import React from 'react';

export type Example = {
  id: string;
  question: React.ReactNode;
  solution: React.ReactNode;
};

export type Topic = {
  id: string;
  title: string;
  videoUrl: string;
  theory?: React.ReactNode;
  examples: Example[];
};

export type Section = {
  id: string;
  title: string;
  topics: Topic[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  sections: Section[];
};
