import Konva from "konva";
import { setCurrentPoint } from "./Actions/setCurrentPoint";
import { store } from "../../Redux/Store/store";

export const handleMouseMove = (event: Konva.KonvaEventObject<MouseEvent>) => {
  const mouseCoords = event.target?.getStage()?.getPointerPosition();

  if (mouseCoords?.x && mouseCoords?.y)
    if (event.evt.button !== 2 && event.target.getStage())
      store.dispatch(setCurrentPoint([mouseCoords.x, mouseCoords.y]));

};
