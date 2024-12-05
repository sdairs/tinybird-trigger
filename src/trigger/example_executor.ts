import { task } from "@trigger.dev/sdk/v3";
import { tinybirdQueryTask } from "./query";
import { tinybirdCopyTask } from "./copy";

const COPY_PIPE_ID = process.env.TINYBIRD_COPY_JOB_PIPE_ID;
const COPY_WITH_PARAM_ID = process.env.TINYBIRD_COPY_WITH_PARAM_ID;

export const exampleExecutor = task({
    id: "example-executor",
    run: async (payload, { ctx }) => {
        console.log("Example executor task is running");

        // Run a copy job
        const copyResult = await tinybirdCopyTask.triggerAndWait({ pipeId: COPY_PIPE_ID });
        console.log(copyResult);

        // Run a copy job with a parameter
        const copyWithParamResult = await tinybirdCopyTask.triggerAndWait({ pipeId: COPY_WITH_PARAM_ID, params: { test_int: "7" } });
        console.log(copyWithParamResult);

        // Run a query with no FORMAT
        const noFormatResult = await tinybirdQueryTask.triggerAndWait({ sql: "SELECT * FROM my_ds" });
        console.log(noFormatResult);

        // Run a query with FORMAT inside the query
        const innerFormatResult = await tinybirdQueryTask.triggerAndWait({ sql: "SELECT * FROM my_ds FORMAT CSV" });
        console.log(innerFormatResult);

        // Run a query with FORMAT outside the query
        const outerFormatResult = await tinybirdQueryTask.triggerAndWait({ sql: "SELECT * FROM my_ds", format: "CSV" });
        console.log(outerFormatResult);

        // Run a query with FORMAT JSON
        const jsonFormatResult = await tinybirdQueryTask.triggerAndWait({ sql: "SELECT * FROM my_ds", format: "JSON" });
        console.log(jsonFormatResult);

        // Run a query with a parameter 
        const paramResult = await tinybirdQueryTask.triggerAndWait({ sql: "% SELECT * FROM my_ds WHERE number == {{Int8(test_int)}}", format: "JSON", params: { test_int: "7" } });
        console.log(paramResult);
    },
});