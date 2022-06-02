import { SET_RANDOMIZATION_STATUS } from "../../../Redux/Actions/ActionTypes";

export const setRandomizationStatus = (randomizationStatus?: 'DONE' | 'PENDING') => {
    return {
        type: SET_RANDOMIZATION_STATUS,

        payload: {
            randomizationStatus
        }
    }
}