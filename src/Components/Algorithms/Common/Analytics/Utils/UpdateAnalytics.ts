import { Action } from "../../../../GUIElements/Types/Redux/Action";
import { UPDATE_SOLUTION_ANALYTICS } from "../../../../Redux/Actions/ActionTypes";
import { Analytics } from "../../Problem/Types/Analytics";

export const updateAnalytics = ( analytics: Analytics ): Action => {
        return {
            type: UPDATE_SOLUTION_ANALYTICS,

            payload: {
                analytics
            }
        }
}