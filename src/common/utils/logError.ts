'use client'

/* eslint-disable no-console */
export interface LogErrorParams {
  error: unknown;
  location: string;
  when: string;
}

export const logError = ({ error, location, when }: LogErrorParams): void => {
  console.log(`Error occured at ${location} when ${when}.
      Full error : ${error}`);
};

