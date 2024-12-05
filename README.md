# tinybird-trigger

Example [trigger.dev](https://trigger.dev) task implementations for Tinybird APIs.

## Tasks

### Query

The [Query](./src/trigger/query.ts) task [executes a SQL query using the Query API](https://www.tinybird.co/docs/api-reference/query-api#post--v0-sql).

### Copy

The [Copy](./src/trigger/copy.ts) task [executes an on-demand Copy job using the Copy API](https://www.tinybird.co/docs/api-reference/pipe-api/copy-pipes-api#post--v0-pipes-(.+)-copy).

## Usage

See the [example_executor](./src/trigger/example_executor.ts) for usage examples.

To run a Copy with no params:

```
const copyResult = await tinybirdCopyTask.triggerAndWait({ pipeId: COPY_PIPE_ID });
```

To run a Copy with params:

```
const copyWithParamResult = await tinybirdCopyTask.triggerAndWait({ pipeId: COPY_WITH_PARAM_ID, params: { test_int: "7" } });
```

To run a Query with no params:

```
const queryResult = await tinybirdQueryTask.triggerAndWait({ sql: "SELECT * FROM table" });
```

To run a Query with params:

```
const paramResult = await tinybirdQueryTask.triggerAndWait({ sql: "% SELECT * FROM my_ds WHERE number == {{Int8(test_int)}}", params: { test_int: "7" } });
```
