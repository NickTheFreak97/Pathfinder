import { Line } from "react-konva";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { State } from "../../GUIElements/Types/Redux/State";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { RunningOptions } from "../../UseCases/RunAlgorithms/Types/RunningOptions";
import { AABBTree, Node } from "./aabbtree";
import { AABB } from "./aabb";

interface RenderHitboxesProps {
    options: RunningOptions,
    tree: AABBTree,
    polygons: Polygon[],
}

const mapStateToProps = (state: State) => {
    return {
        options: state.options,
        tree: state.AABBTree,
        polygons: state.polygons,
    }
}

const RenderHitboxes: React.FC<RenderHitboxesProps> = ({options, tree, polygons}) => {

    useEffect(
        ()=>{
            /* console.log(tree.AllNodes); */
        }, [polygons]
    )

    return <React.Fragment>
        {
            tree.AllNodes.map(
                (node: Node) => 
                    <Line
                        points={
                                [   node.aabb.min.x, node.aabb.min.y, //TL
                                    node.aabb.max.x, node.aabb.min.y, //TR
                                    node.aabb.max.x, node.aabb.max.y, //BR
                                    node.aabb.min.x, node.aabb.max.y, //BL
                                    node.aabb.min.x, node.aabb.min.y, //TL
                                ]
                            }
                        
                        stroke={!!node.entity ? 
                            tree.queryRegion(node.aabb).length <= 1? 
                                "orange":
                                "red"
                                :
                            "blue"}
                    />
            )
        }
    </React.Fragment>
}

export default connect(mapStateToProps)(RenderHitboxes);