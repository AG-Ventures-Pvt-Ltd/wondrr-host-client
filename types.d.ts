import { Connection } from "mongoose";

declare global {
  var mongoose: {
    connection: Connection | null;
    promise: Promise<Connection> | null;
  };
}

declare module "next-auth" {
  interface User {
    _id?: string;
    fullName: string;
  }
  interface Session {
    user?: {
      id: string;
      email: string;
      fullName?: string;
    };
  }
}

