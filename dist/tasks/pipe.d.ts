interface PipePayload {
    name: string;
    params?: Record<string, string | number | boolean>;
    token?: string;
}
interface TinybirdJSONResponse {
    meta: {
        name: string;
        type: string;
    }[];
    data: Record<string, any>[];
    rows: number;
    statistics: {
        elapsed: number;
        rows_read: number;
        bytes_read: number;
    };
}
export declare const tinybirdPipeTask: import('@trigger.dev/sdk/v3').Task<"tinybird-pipe", PipePayload, TinybirdJSONResponse>;
export {};
