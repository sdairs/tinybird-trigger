interface QueryPayload {
    sql: string;
    params?: Record<string, string | number | boolean>;
    format?: string;
    token?: string;
}
export declare enum Format {
    CSV = "CSV",
    CSVWithNames = "CSVWithNames",
    JSON = "JSON",
    TSV = "TSV",
    TSVWithNames = "TSVWithNames",
    PrettyCompact = "PrettyCompact",
    JSONEachRow = "JSONEachRow",
    Parquet = "Parquet"
}
export declare const tinybirdQueryTask: import('@trigger.dev/sdk/v3').Task<"tinybird-query", QueryPayload, any>;
export {};
