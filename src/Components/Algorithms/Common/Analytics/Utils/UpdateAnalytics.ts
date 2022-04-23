import { Action } from "../../../../GUIElements/Types/Redux/Action";
import { UPDATE_SOLUTION_ANALYTICS } from "../../../../Redux/Actions/ActionTypes";
import { estimateMemoryUsage } from "../../../../UseCases/MonitorPerformance/MemoryUsage";
import { Analytics } from "../../Problem/Types/Analytics";

export const updateAnalytics = ( analytics: Analytics, completionTime: number ): Action => {

        analytics.memory = estimateMemoryUsage();
        analytics.completionTime = completionTime;

        return {
            type: UPDATE_SOLUTION_ANALYTICS,

            payload: {
                analytics
            }
        }
}