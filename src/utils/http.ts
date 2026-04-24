import { Http, Device, isIOS, HttpResponse as NativeScriptHttpResponse } from "@nativescript/core";
import { useSettings } from "@/pinia/settings";
import debug from "./debug";
const pjson: PackageJson = require("/package.json");

export const http = function (params: RequestParams): Promise<Record<string, any>> {
  const method = params.method || "GET";
  const url = `${process.env.HTTP_BASE_URL}${params.endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Language": useSettings().language,
  };

  if (pjson?.version) {
    headers["X-App-Version"] = pjson.version;
  }
  if (Device.uuid) {
    headers["X-App-Id"] = `${isIOS ? "ios" : "android"}-${Device.uuid}`;
  }

  const request: HttpRequest = { url, method, headers };

  if (method !== "GET" && method !== "DELETE") {
    request.content = JSON.stringify(params.request || {});
  }
  if (params.overrideAuthorizationHeader) {
    request.headers["Authorization"] = params.overrideAuthorizationHeader;
  }

  debug.log(`🌐 → ${method} ${request.url}`);
  debug.out(request, "🌐 request");

  return new Promise((resolve, reject) => {
    return Http.request(request)
      .then(
        (response: NativeScriptHttpResponse) => {
          if (response.statusCode === 200 || response.statusCode === 201 || response.statusCode === 204) {
            try {
              debug.log(`🌐 ✅ ${response.statusCode} ${request.url}`);
              const body = response.content && response.content.toString() ? response.content.toJSON() : {};
              debug.out(body, "🌐 response");
              return resolve(body);
            } catch (error) {
              debug.log(`🌐 ⛔ Could not parse response: ${response.content}`);
              return reject();
            }
          } else if (response.statusCode === 500) {
            debug.log(`🌐 🔥 ${response.statusCode} ${request.url} — ${response.content}`);
            return reject();
          } else if (response.statusCode === 429) {
            debug.log(`🌐 ⚠️ 429 Too Many Requests — ${request.url}`);
            return reject();
          } else {
            debug.log(`🌐 ⛔ ${response.statusCode} ${request.url} — ${response.content}`);
            const contentWithStatusCode = response.content as any;
            contentWithStatusCode.serverStatusCode = response.statusCode;

            return reject();
          }
        },
        (e: Error) => {
          debug.log(`🌐 💥 Request crashed: ${e}`);
          return reject();
        }
      )
      .catch((e: Error) => {
        debug.log(`🌐 💥 Request crashed: ${e}`);
        return reject();
      });
  });
};


interface PackageJson {
  version?: string;
}

interface RequestParams {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  request?: Record<string, any>;
  useCustomError?: boolean;
  skipErrorParsing?: boolean;
  overrideAuthorizationHeader?: string;
}

interface HttpRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  content?: string;
}
