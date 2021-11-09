export type TestCaseType = {
  name: string;
  url: string;
  isPartner?: true;
  skip?: boolean;
  skipBlankValuesCheck?: boolean;
  skipBlankValuesCheckReason?: string;
};
export type TestCasesType = TestCaseType[];
