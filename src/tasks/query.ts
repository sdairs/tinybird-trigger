import { logger, task } from "@trigger.dev/sdk/v3";

const TINYBIRD_TOKEN = process.env.TINYBIRD_TOKEN ?? undefined;

interface QueryPayload {
  sql: string;
  params?: Record<string, string | number | boolean>;
  format?: string;
  token?: string;
}

interface TinybirdErrorResponse {
  error: string;
  detail?: string;
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

type TinybirdSuccessResponse = Format extends Format.JSON ? TinybirdJSONResponse : any;

export enum Format {
  CSV = "CSV",
  CSVWithNames = "CSVWithNames",
  JSON = "JSON",
  TSV = "TSV",
  TSVWithNames = "TSVWithNames",
  PrettyCompact = "PrettyCompact",
  JSONEachRow = "JSONEachRow",
  Parquet = "Parquet"
}

function isValidFormat(format: string): format is Format {
  return Object.values(Format).includes(format as Format);
}

function extractFormat(query: string): Format | null {
  const match = query.trim().match(/FORMAT\s+(\w+)$/i);
  if (!match) return null;

  const format = match[1].toUpperCase();
  return isValidFormat(format) ? format as Format : null;
}

export const tinybirdQueryTask = task({
  id: "tinybird-query",
  run: async (payload: QueryPayload) => {
    const token = TINYBIRD_TOKEN ?? payload.token;
    if (!token) {
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    }

    if (!payload.sql) {
      throw new Error("SQL query is required");
    }

    let query = payload.sql;
    const queryFormat = extractFormat(query);

    // Validate payload format if provided
    if (payload.format && !isValidFormat(payload.format.toUpperCase())) {
      throw new Error(`Invalid format: ${payload.format}. Valid formats are: ${Object.values(Format).join(", ")}`);
    }

    // Use format from payload if specified, otherwise use format from query, fallback to JSON
    const format = (payload.format?.toUpperCase() ?? queryFormat ?? Format.JSON) as Format;

    // Only append format if it's not already in the query
    if (!queryFormat) {
      query += ` FORMAT ${format}`;
    }

    try {
      const response = await fetch(
        `https://api.tinybird.co/v0/sql`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            q: query,
            ...payload.params,
          }),
        }
      );

      const result = await response.json();
      console.log(result);

      if (response.status !== 200) {
        let errorResponse: TinybirdErrorResponse = {
          error: "error",
        };
        if ("error" in result) {
          errorResponse = result as TinybirdErrorResponse;
          logger.error("Tinybird query failed", {
            error: errorResponse.error,
            detail: errorResponse.detail,
          });
        }
        throw new Error(`Tinybird query failed: ${errorResponse.error}`);
      }

      const successResponse = result as TinybirdSuccessResponse;

      logger.info("Query executed successfully", successResponse);

      return successResponse;

    } catch (error) {
      logger.error("Failed to execute Tinybird query", {
        error: error instanceof Error ? error.message : "Unknown error",
        sql: payload.sql,
      });
      throw error;
    }
  },
});