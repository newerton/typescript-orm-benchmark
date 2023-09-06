import type * as ImmudbClient from "@codenotary/immudb-node";

const dynamicImport = async (packageName: string) =>
  new Function(`return import('${packageName}')`)();

export const getDbInstance = async (): Promise<ImmudbClient.Client> => {
  let db = null;
  try {
    db = new (await dynamicImport("@codenotary/immudb-node")).Client({
      host: "127.0.0.1",
      port: 3322,
      user: "immudb",
      password: "immudb",
      database: "defaultdb",
    });
  } catch (err: any) {
    console.error("Not connected");
    console.error(err.details);
  }
  return db;
};
