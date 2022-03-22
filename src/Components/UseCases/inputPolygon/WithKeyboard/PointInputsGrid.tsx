import React from 'react';
import { ScrollArea, Title, Container } from '@mantine/core';
import { connect } from 'react-redux';
import { State } from '../../../GUIElements/Types/Redux/State';
import { Vertex } from '../../../GUIElements/Types/Shapes/PolygonGUIProps';
import PointInput from './PointInput';


const mapStateToProps = (state: State) => {
    return {
        vertices: state.newPolygonVertices,
    }
}

interface PointInputsGridProps {
    vertices: Vertex[]
}

const PointInputsGrid : React.FC<PointInputsGridProps>  = ({ vertices }) => {

    return <ScrollArea style={{display: "flex", flexDirection: "column", alignItems: "flex-start", flexBasis: '77%', flexGrow: 0}}>

        <Title ml={2} mb={5} mt={10} order={4}>
            Polygon input
        </Title>
        <Container style={{height: '100%', width: '100%'}}  >
            {
                vertices.map( (_, idx: number) => <PointInput pointID={idx} key={idx}/> ) 
            }
        </Container>  

    </ScrollArea>


}

export default connect(mapStateToProps)(PointInputsGrid);