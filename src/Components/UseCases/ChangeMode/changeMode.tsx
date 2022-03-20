import { InteractionMode } from '../../Utils/interactionMode';
import { CHANGE_INTERACTION_MODE } from '../../Redux/Actions/ActionTypes';

export const changeMode = (newMode : InteractionMode) => {
    return {
        type: CHANGE_INTERACTION_MODE,
        
        payload: {
            mode: newMode
        }
    }
}

interface ChangeModePayload {
    mode: InteractionMode,
}

export interface ChangeModeAction {
    type: string,
    payload: ChangeModePayload,
} 