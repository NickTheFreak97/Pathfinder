import { sizeof } from "sizeof";
import { store } from "../../Redux/Store/store";

export const typeSizes = {
    "undefined": () => 0,
    "boolean": () => 4,
    "number": () => 8,
    "string": (item: string) : number => 2 * item.length,
    "object": (item: any) : number => sizeof(item),
    "symbol": () => 0,
    "bigint": () => 2048,
    "function": () => 0,
  };
  

export const estimateMemoryUsage = (): number => {
  return typeSizes.object(store.getState().frontier) + typeSizes.object(store.getState().explored) /* + typeSizes.object(store.getState().visibilityMap) */;
}