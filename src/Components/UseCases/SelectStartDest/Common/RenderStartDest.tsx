import { Layer } from "react-konva";
import { connect } from 'react-redux';
import { validate } from "uuid";

import Point from '../../../GUIElements/Shapes/Point';

import { State } from "../../../GUIElements/Types/Redux/State";
import { PointInfo } from "../../../GUIElements/Types/Shapes/PointInfo";

interface RenderStartDestProps {
    startPoint: PointInfo | null | undefined
}

const mapStateToProps = (state: State) => {
    return {
        startPoint: state.startPoint,
    }
}

const RenderStartDest : React.FC<RenderStartDestProps> = ({startPoint}) => {
    return <Layer>
        {
            ( !!startPoint && validate(startPoint.id) ) &&
            <Point
                x={startPoint.coordinates.x!}
                y={startPoint.coordinates.y!}
                name={startPoint.id}
            />
        }
    </Layer>
}

export default connect(mapStateToProps)(RenderStartDest);