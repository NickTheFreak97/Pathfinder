import Konva from "konva";
import { setCurrentPoint } from "../Actions/setCurrentPoint";
import { store } from "../../../Redux/Store/store";
import { Vertex } from "../../../GUIElements/Types/Shapes/PolygonGUIProps";

export const handleMouseMove = (event: Konva.KonvaEventObject<MouseEvent>) => {
  const mouseCoords = event.target?.getStage()?.getPointerPosition();
  const lastPoint : Vertex | null | undefined = store.getState().currentPoint;

  if (mouseCoords?.x && mouseCoords?.y && !!lastPoint)
    if (event.evt.button !== 2 && event.target.getStage())
      store.dispatch(setCurrentPoint([mouseCoords.x, mouseCoords.y]));

};
