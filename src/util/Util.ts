export default {
  fileSize(bytes: number): string {
    const out =
      bytes < 1000
        ? {
            value: bytes,
            prefix: '',
          }
        : bytes < 1000000
          ? {
              value: bytes / 1000,
              prefix: 'k',
            }
          : bytes < 1000000000
            ? {
                value: bytes / 1000000,
                prefix: 'M',
              }
            : bytes < 1000000000
              ? {
                  value: bytes / 1000,
                  prefix: 'G',
                }
              : {
                  value: bytes,
                  prefix: '',
                };
    return `${Math.round(out.value)} ${out.prefix}B`;
  },
};
