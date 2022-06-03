/**
 * Konva's Transformer implementation, from the top answer of the following topic:
 * https://stackoverflow.com/questions/50838007/react-konva-handle-transformer-select-deselect-and-hover/50870254
 */
import Konva from "konva";
import React, { useEffect, useState } from "react";
import { Transformer } from "react-konva";
import { connect } from "react-redux";
import { State } from "../Types/Redux/State";

interface TransformerProps {
  selectedPolygonID: string | null | undefined;
}

const mapStateToProps = (state: State) => {
  return {
    selectedPolygonID: state.selectedPolygonID,
  };
};

const TransformerComponent: React.FC<TransformerProps> = ({
  selectedPolygonID,
}) => {
  let [transformerNode, setTransformerNode] =
    useState<Konva.Transformer | null>(null);

  useEffect(() => {
    checkNode();
  }, [selectedPolygonID]);

  const checkNode = () => {
    const stage = transformerNode?.getStage();
    
    if (!!stage && !!transformerNode) {
      const selectedNode = stage.findOne("." + selectedPolygonID);

      if (selectedNode === transformerNode?.nodes()[0]) 
        return;

      if (selectedNode) {
        transformerNode.attachTo(selectedNode);
      } else {
        transformerNode.detach();
      }
      transformerNode?.getLayer()?.batchDraw();
    }
  };

  return (
    <React.Fragment>
      <Transformer
        ref={(node) => {
          setTransformerNode(node);
        }}
      />
    </React.Fragment>
  );
};

export default connect(mapStateToProps)(TransformerComponent);
