import React, { useState, Dispatch } from 'react';
import { MultiSelect, Stack, Checkbox, Button } from '@mantine/core';
import { connect } from 'react-redux';
import { runAlgorithms } from './run';

import { State } from '../../GUIElements/Types/Redux/State';
import { InteractionMode } from '../../Utils/interactionMode';
import { Polygon } from '../../GUIElements/Types/Shapes/Polygon';
import { RunningOptions, updateRunningOptions } from './RunningOptions';
import { Action } from '../../GUIElements/Types/Redux/Action';
import { PointInfo } from '../../GUIElements/Types/Shapes/PointInfo';
import { Algorithms, SelectedAlgorithms, makeEmptySelectedAlgorithms } from './SelectedAlgorithms';

const mapStateToProps = (state: State) => {
    return {
        usageMode: state.useMode,
        polygons: state.polygons,
        options: state.options,
        startPoint: state.startPoint,
        destinationPoint: state.destinationPoint,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
    return {
        updateOptions: ( options: RunningOptions ) : void => dispatch( updateRunningOptions(options) ), 
    }
}

interface AlgorithmsSelectorProps {
    usageMode: InteractionMode,
    polygons: Polygon[],
    options: RunningOptions,
    startPoint: PointInfo | null | undefined,
    destinationPoint: PointInfo | null | undefined,
    updateOptions: (options: RunningOptions) => void,
}

const data = [
    { value: Algorithms.BFS, label: 'Breadth Frist' },
    { value: Algorithms.DFS, label: 'Depth First' },
    { value: Algorithms.UC, label: 'Uniform cost' },
    { value: Algorithms.ID, label: 'Iterative Deepening' },
    { value: Algorithms.AStart, label: 'A*' },
  ];

const AlgorithmsSelector: React.FC<AlgorithmsSelectorProps> = ({ usageMode, polygons, options, startPoint, destinationPoint, updateOptions }) => {
    
    const [ selectedAlgorithms, setSelectedAlgorithms ] = useState<SelectedAlgorithms>(makeEmptySelectedAlgorithms());

    const updateSelectedAlgorithms = (selected: string[]) : SelectedAlgorithms=> {
        const newAlgorithms: SelectedAlgorithms = makeEmptySelectedAlgorithms();

        selected.forEach( (selectedAlgo: string) => {
            if( selectedAlgo in newAlgorithms) 
                newAlgorithms[selectedAlgo as Algorithms] = true; 
        })
        
        return newAlgorithms;
    }
      

    if( usageMode !== InteractionMode.RUN_ALGORITHM )
        return null;
    else
        return (
            <React.Fragment>
                <MultiSelect
                    style={{
                        marginTop: '0.75rem'
                    }}
                    data={data}
                    onChange={ ( selected: string[] ) => setSelectedAlgorithms( updateSelectedAlgorithms(selected) ) }
                    label="Select algorithms to run"
                    placeholder="Pick the algorithms to run"
                />

                <Stack justify="flex-start" spacing="xs" style={{ height: 300, marginTop: '1.25rem' }}>
                    <Checkbox
                        label="Compute effective branching factor"
                        color="dark"
                        radius="xs"
                        onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => {
                            updateOptions( {...options, computeEFB: event.currentTarget.checked} )
                        }} 
                        />
                    
                    <Checkbox
                        label="Verbose mode"
                        color="dark"
                        radius="xs"
                        onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => {
                            updateOptions( {...options, verbose: event.currentTarget.checked} )
                        }}
                        />

                    <Checkbox
                        label="Save log"
                        color="dark"
                        radius="xs"
                        onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => {
                            updateOptions( {...options, log: event.currentTarget.checked} )
                        }}
                        />

                    <Button color="dark" style={{marginTop: "0.5rem", alignSelf: "flex-start"}}
                        disabled={  polygons.length <= 0 || !startPoint || !destinationPoint ||
                                    polygons.reduce( ( currentVal: boolean, polygon: Polygon ) => currentVal || !polygon.isConvex , false) ||
                                    !Object.keys(selectedAlgorithms).reduce( (currentVal: boolean, algo: string) => currentVal || selectedAlgorithms[algo as Algorithms], false )
                                }
                        onClick={ ()=> runAlgorithms(selectedAlgorithms) }>
                        Find path
                    </Button>
                </Stack>
                
            </React.Fragment>
        );
        
}

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsSelector);
