import { v4 as uuidv4 } from "uuid";
import { Line } from "react-konva";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { State } from "../../GUIElements/Types/Redux/State";
import { Polygon } from "../../GUIElements/Types/Shapes/Polygon";
import { RunningOptions } from "../../UseCases/RunAlgorithms/Types/RunningOptions";
import { AABBTree, Node } from "./aabbtree";
import { AABB } from "./aabb";
import { Box } from "./box";

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
        {   options.verbose.show.hitboxes && 
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
                                `rgba(255, 153, 51, ${options.verbose.opacity.hitboxes/100})`:
                                `rgba(255, 0, 0, ${options.verbose.opacity.hitboxes/100})`
                                :
                                `rgba(32, 201, 151, ${options.verbose.opacity.hitboxes/100})`}
                                key={(!!node.entity) ? (node.entity as Box).id : uuidv4() }
                    />
            )
        }
    </React.Fragment>
}

export default connect(mapStateToProps)(RenderHitboxes);