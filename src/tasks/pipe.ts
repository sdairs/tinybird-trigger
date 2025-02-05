import { logger, task } from "@trigger.dev/sdk/v3";

const TINYBIRD_TOKEN = process.env.TINYBIRD_TOKEN ?? undefined;

interface PipePayload {
  name: string;
  params?: Record<string, string | number | boolean>;
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

export const tinybirdPipeTask = task({
  id: "tinybird-pipe",
  run: async (payload: PipePayload) => {
    const token = TINYBIRD_TOKEN ?? payload.token;
    if (!token) {
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    }

    if (!payload.name) {
      throw new Error("Pipe name is required");
    }

    try {

      logger.log(`Calling pipe ${payload.name}`);

      const apiUrl: URL = new URL(`https://api.tinybird.co/v0/pipes/${payload.name}.json`);
      if (payload.params) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(payload.params)) {
          searchParams.append(key, value.toString());
        }
        apiUrl.search = searchParams.toString();
      }
      logger.log(`Calling ${apiUrl.toString()}`);
      logger.log(`token ${token}`);

      const response = await fetch(
        apiUrl,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      logger.log(`Response from pipe ${payload.name}. Status: ${response.status}`);

      if (response.status !== 200) {
        let errorResponse: TinybirdErrorResponse = {
          error: "error",
        };
        if ("error" in result) {
          errorResponse = result as TinybirdErrorResponse;
          logger.error("Tinybird API request failed", {
            error: errorResponse.error,
            detail: errorResponse.detail,
          });
        }
        throw new Error(`Tinybird API request failed: ${errorResponse.error}`);
      }

      const successResponse = result as TinybirdJSONResponse;

      return successResponse;

    } catch (error) {
      logger.error("Failed to call Tinybird API", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  },
});