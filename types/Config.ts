export default interface Config {
  artifactory: {
    host: string;
    repoKey: string;
    https: boolean;
    apiKey: string;
  };
  companyScope: string;
  howto?: {
    default?: boolean;
    additional?: {
      markup: string;
      heading: string;
    };
  };
}

export enum Status {
  loading,
  firstStartUp,
  configured,
}
