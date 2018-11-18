export default interface Config {
  artifactory: {
    host: string;
    repoKey: string;
    https: boolean;
    apiKey: string;
  };
  companyScope: string;
}

export enum Status {
  loading,
  firstStartUp,
  configured,
}
