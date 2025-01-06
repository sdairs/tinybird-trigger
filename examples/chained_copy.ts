import { task } from "@trigger.dev/sdk/v3";
import { tinybirdCopyTask } from "@sdairs/tinybird-trigger-tasks";

export const chainedCopy = task({
    id: "chained-copy",
    run: async (payload, { ctx }) => {
        console.log("Chained copy task is running");


        const copyOneResult = await tinybirdCopyTask.triggerAndWait({ pipeId: "t_a193c6df6f2649d5887f35252af2a256" });
        console.log(copyOneResult);

        if (copyOneResult.ok) {
            const copyTwoResult = await tinybirdCopyTask.triggerAndWait({ pipeId: "t_386c80fe9a7344219b11f4474fff3442" });
            console.log(copyTwoResult);
        }

    },
});