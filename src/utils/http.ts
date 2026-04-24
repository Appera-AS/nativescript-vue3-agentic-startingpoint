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
          const statusCode = response.statusCode;
          const rawContent = response.content;

          if (statusCode >= 200 && statusCode < 300) {
            debug.log(`🌐 ✅ ${statusCode} ${request.url}`);
            const text = rawContent?.toString() ?? "";
            if (!text) return resolve({});
            try {
              const body = rawContent!.toJSON();
              debug.out(body, "🌐 response");
              return resolve(body);
            } catch {
              debug.log(`🌐 ⚠️ Non-JSON response — returning raw text`);
              return resolve({ raw: text });
            }
          }

          const content = rawContent?.toString() ?? "";
          if (statusCode === 429) {
            debug.log(`🌐 ⚠️ 429 Too Many Requests — ${request.url}`);
          } else if (statusCode >= 500) {
            debug.log(`🌐 🔥 ${statusCode} ${request.url} — ${content}`);
          } else {
            debug.log(`🌐 ⛔ ${statusCode} ${request.url} — ${content}`);
          }
          return reject({ statusCode, content });
        },
        (e: Error) => {
          debug.log(`🌐 💥 Request crashed: ${e}`);
          return reject({ statusCode: 0, error: e });
        }
      )
      .catch((e: Error) => {
        debug.log(`🌐 💥 Request crashed: ${e}`);
        return reject({ statusCode: 0, error: e });
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
