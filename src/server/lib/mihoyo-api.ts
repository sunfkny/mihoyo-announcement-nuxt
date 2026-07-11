export type MihoyoSubdomain
  = | "announcement-static"
    | "announcement-api"
    | "hkrpg-ann-api"
    | "hk4e-ann-static"
    | "hk4e-ann-api"
    | "ann-api";

export type MihoyoBaseUrl = `https://${MihoyoSubdomain}.mihoyo.com/`;

export function getMihoYoBaseUrl(subdomain: MihoyoSubdomain): MihoyoBaseUrl {
  return `https://${subdomain}.mihoyo.com/`;
}

export type BaseResponse = {
  retcode: number;
  message: string;
  data: unknown;
};

export function checkResponse(resp: BaseResponse) {
  if (resp.retcode !== 0) {
    throw new Error(`Error ${resp.retcode} ${resp.message}`, { cause: resp });
  }
}
