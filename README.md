# @sdairs/tinybird-trigger-tasks

A collection of [trigger.dev](https://trigger.dev) task implementations for Tinybird APIs.

## Installation

```bash
npm install @sdairs/tinybird-trigger-tasks
# or
yarn add @sdairs/tinybird-trigger-tasks
# or
pnpm add @sdairs/tinybird-trigger-tasks
```

## Tasks

### Query

The [Query](./src/tasks/query.ts) task [executes a SQL query using the Query API](https://www.tinybird.co/docs/api-reference/query-api#post--v0-sql).

### Copy

The [Copy](./src/tasks/copy.ts) task [executes an on-demand Copy job using the Copy API](https://www.tinybird.co/docs/api-reference/pipe-api/copy-pipes-api#post--v0-pipes-(.+)-copy).

## Usage

You can provide your Tinybird API token either through the environment variable `TINYBIRD_TOKEN` or directly in the task payload.

### Copy Task

To run a Copy with no params:

```typescript
import { tinybirdCopyTask } from '@sdairs/tinybird-trigger-tasks';

const copyResult = await tinybirdCopyTask.triggerAndWait({ 
  pipeId: "YOUR_COPY_PIPE_ID",
  token: "YOUR_TOKEN" // Optional if TINYBIRD_TOKEN env var is set
});
```

To run a Copy with params:

```typescript
const copyWithParamResult = await tinybirdCopyTask.triggerAndWait({ 
  pipeId: "YOUR_COPY_WITH_PARAM_ID", 
  params: { test_int: "7" },
  token: "YOUR_TOKEN" // Optional if TINYBIRD_TOKEN env var is set
});
```

### Query Task

To run a Query with no params:

```typescript
import { tinybirdQueryTask } from '@sdairs/tinybird-trigger-tasks';

const queryResult = await tinybirdQueryTask.triggerAndWait({ 
  sql: "SELECT * FROM table",
  token: "YOUR_TOKEN" // Optional if TINYBIRD_TOKEN env var is set
});
```

To run a Query with params:

```typescript
const paramResult = await tinybirdQueryTask.triggerAndWait({ 
  sql: "% SELECT * FROM my_ds WHERE number == {{Int8(test_int)}}", 
  params: { test_int: "7" },
  token: "YOUR_TOKEN" // Optional if TINYBIRD_TOKEN env var is set
});
```
