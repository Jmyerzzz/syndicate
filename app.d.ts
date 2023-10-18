/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./auth/lucia").Auth;
  type DatabaseUserAttributes = {
    name: string;
    risk_percentage: number;
    gabe_way: number;
    username: string;
  };
  type DatabaseSessionAttributes = {};
}