import { Dispatch } from "react";
import { Action } from "../../../../GUIElements/Types/Redux/Action";
import { State } from "../../../../GUIElements/Types/Redux/State";
import { UPDATE_SOLUTION_ANALYTICS } from "../../../../Redux/Actions/ActionTypes";
import { estimateMemoryUsage } from "../../../../UseCases/MonitorPerformance/MemoryUsage";
import { Analytics } from "../../Problem/Types/Analytics";

export const updateAnalytics = ( analytics: Analytics, completionTime: number )  => 
    (dispatch: Dispatch<Action>, state: () => State) =>  {

        analytics.memory = estimateMemoryUsage();
        analytics.completionTime = completionTime;

        dispatch(_updateAnalytics(analytics));
}

const _updateAnalytics = (analytics: Analytics): Action => {
    return {
        type: UPDATE_SOLUTION_ANALYTICS,

        payload: {
            analytics
        }
    }
}