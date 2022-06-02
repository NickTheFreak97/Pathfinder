import { RESET_AABB_TREE } from "../../../Redux/Actions/ActionTypes";

export const resetAABBTree = () => {
    return {
        type: RESET_AABB_TREE,

        payload: {}
    }
}