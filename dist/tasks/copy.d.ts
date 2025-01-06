interface CopyPayload {
    pipeId: string;
    token?: string;
    params?: {
        [key: string]: string;
    };
}
export declare const tinybirdCopyTask: import('@trigger.dev/sdk/v3').Task<"copy_job", CopyPayload, {
    success: boolean;
    jobId: any;
}>;
export {};
