/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
import { JestConfigWithTsJest } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist/', 'node_modules/', './test.ts'],

  // this enables us to use tsconfig-paths with jest
  modulePaths: [compilerOptions.baseUrl],
};

export default jestConfig;
