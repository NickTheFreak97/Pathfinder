import { Polygon } from "../Shapes/Polygon";
import { InteractionMode } from "../../../Utils/interactionMode";

export interface State {
    polygons: Polygon[],
    useMode: InteractionMode,
}