import { Deta } from "deta";

const deta = Deta();

const cookiesDB = deta.Base("cookies_db");

export { cookiesDB };
