import { logger, task, wait } from "@trigger.dev/sdk/v3";

const TINYBIRD_TOKEN = process.env.TINYBIRD_TOKEN ?? undefined;

interface CopyPayload {
  pipeId: string;
  token?: string;
  params?: { [key: string]: string };
}

export const tinybirdCopyTask = task({
  id: "copy_job",
  run: async (payload: CopyPayload) => {
    const token = TINYBIRD_TOKEN ?? payload.token;
    if (!token) {
      throw new Error("Tinybird API token not found. Either set the TINYBIRD_TOKEN environment variable, or provide a token in the task payload.");
    }
    if (!payload.pipeId) {
      throw new Error("Pipe ID not found");
    }

    try {
      let url = `https://api.tinybird.co/v0/pipes/${payload.pipeId}/copy`;

      // Add search params if they exist
      if (payload.params) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(payload.params)) {
          searchParams.append(key, value.toString());
        }
        url += `?${searchParams.toString()}`;
      }

      const copyJobResponse = await fetch(
        url,
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${TINYBIRD_TOKEN}`
          }
        }
      ).then((r) => r.json());

      if (!copyJobResponse || !('job' in copyJobResponse)) {
        logger.error(copyJobResponse);
        throw new Error('Invalid response from Tinybird API');
      }

      const jobId = copyJobResponse.job.job_id;
      logger.log("Copy job started", { jobId });

      let jobStatus = '';
      const maxAttempts = 30;
      let attempts = 0;

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(
          `https://api.tinybird.co/v0/jobs/${jobId}`,
          {
            headers: {
              'Authorization': `Bearer ${TINYBIRD_TOKEN}`
            }
          }
        ).then((r) => r.json());

        jobStatus = statusResponse.status;

        logger.log("Job status check", { jobId, status: jobStatus, attempt: attempts + 1 });

        if (jobStatus === 'done') {
          logger.log("Copy job completed successfully", { jobId });
          return { success: true, jobId };
        }

        if (jobStatus === 'error' || jobStatus === 'failed') {
          throw new Error(`Copy job failed with status: ${jobStatus}`);
        }

        await wait.for({ seconds: 5 });
        attempts++;
      }

      throw new Error(`Job timed out after ${maxAttempts} attempts`);
    } catch (error) {
      logger.error("Error in Tinybird copy job", { error });
      throw error;
    }
  },
});