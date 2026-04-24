import { useDebug } from "@/pinia/debug";

const bootstrapEmojis = ["✅", "⛔️", "⛔", "⚠️"];

const log = (params: any): void => {
  const $d = useDebug();
  if (!$d.enableDebug) return;

  if (typeof params !== "string") {
    console.log(params);
    return;
  }

  if ((params.startsWith("🍍") || params.startsWith(" ⚬")) && !$d.enablePiniaLogs) return;
  if (params.startsWith("🌐") && !$d.enableNetworkLogs) return;
  if (bootstrapEmojis.some((e) => params.startsWith(e)) && !$d.enableBootstrapLogs) return;

  console.log(params);
};

const dir = (params: any): void => {
  if (!useDebug().enableDebug) return;
  console.dir(params);
};

const out = (params: any, label?: string): void => {
  if (!useDebug().enableDebug) return;
  const prefix = label ? `💭 ${label}` : "💭 DEBUG";

  if (Array.isArray(params)) {
    if (params.length === 0) {
      console.log(`${prefix} (empty array)`);
      return;
    }
    console.log(`${prefix} (array with ${params.length} items):`);
    params.forEach((value: any, index: number) => {
      if (typeof value === "object" && value !== null) {
        console.log(`   [${index}]:`);
        Object.keys(value).forEach((key: string) => {
          console.log(`     ${key}: ${value[key]}`);
        });
      } else {
        console.log(`   [${index}]: ${value}`);
      }
    });
  } else if (typeof params === "object" && params !== null) {
    console.log(`${prefix} (object):`);
    Object.keys(params).forEach((key: string) => {
      console.log(`   ${key}: ${params[key]}`);
    });
  } else {
    console.log(`${prefix} (${typeof params}):`);
    console.log(`   ${params}`);
  }
};

export default { log, dir, out };
