import React, { Dispatch, useState } from 'react';
import { MultiSelect, Stack, Checkbox, Button, Accordion, Slider, Title, Group, Text, ScrollArea } from '@mantine/core';
import { connect } from 'react-redux';
import { runAlgorithms } from './onRun';
import { store } from '../../Redux/Store/store';

import { State } from '../../GUIElements/Types/Redux/State';
import { InteractionMode } from '../../Utils/interactionMode';
import { Polygon } from '../../GUIElements/Types/Shapes/Polygon';
import { RunningOptions, updateRunningOptions } from './Types/RunningOptions';
import { Action } from '../../GUIElements/Types/Redux/Action';
import { PointInfo } from '../../GUIElements/Types/Shapes/PointInfo';
import { Algorithms, SelectedAlgorithms, makeEmptySelectedAlgorithms } from './Types/SelectedAlgorithms';

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

    const updateChecked = ( key: "frontier" | "explored" | "solution" | "visibility", checked: boolean ) => {
        const currentOptions: RunningOptions = store.getState().options;
        const newOptions: RunningOptions = {
            ...currentOptions, 
            verbose: {
                show: { 
                    ...currentOptions.verbose.show, 
                    [key]: checked 
                },

                opacity: {
                    ...currentOptions.verbose.opacity,
                }
            } 
        }

        updateOptions(newOptions);
    } 

    const updateOpacity = ( key: "frontier" | "explored" | "solution" | "visibility", opacity: number ) => {
        const currentOptions: RunningOptions = store.getState().options;
        const newOptions: RunningOptions = {
            ...currentOptions, 
            verbose: { 
                show: {
                    ...currentOptions.verbose.show,
                }, 

                opacity: {
                    ...currentOptions.verbose.opacity, 
                    [key]: opacity
                } 
            } 
        }
        updateOptions( newOptions );
    }

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
            <ScrollArea style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                flexBasis: "77%",
                flexGrow: 0,
                maxWidth: '250px',
              }}>
                <MultiSelect
                    style={{
                        marginTop: '0.75rem'
                    }}
                    data={data}
                    onChange={ ( selected: string[] ) => setSelectedAlgorithms( updateSelectedAlgorithms(selected) ) }
                    label="Select algorithms to run"
                    placeholder="Pick the algorithms to run"
                />

                <Stack justify="flex-start" spacing="xs" style={{ marginTop: '1.25rem' }}>
                    <Checkbox
                        label="Compute effective branching factor"
                        color="dark"
                        radius="xs"
                        checked={options.computeEFB}
                        disabled={!selectedAlgorithms.BFS}
                        onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => {
                            updateOptions( {...options, computeEFB: event.currentTarget.checked} )
                        }} 
                        />

                    <Checkbox
                        label="Save log"
                        color="dark"
                        radius="xs"
                        checked={options.log}
                        onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => {
                            updateOptions( {...options, log: event.currentTarget.checked} )
                        }}
                        />

                    <Accordion iconPosition="right">
                        <Accordion.Item label="Visibility">
                        <Stack justify="flex-start" spacing="xs" >
                            <Checkbox
                                label="Show frontier"
                                color="dark"
                                radius="xs"
                                checked={options.verbose.show.frontier}
                                onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => updateChecked("frontier", event.currentTarget.checked )}
                                />

                                <Checkbox
                                    label="Show explored"
                                    color="dark"
                                    radius="xs"
                                    checked={options.verbose.show.explored}
                                    onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => updateChecked("explored", event.currentTarget.checked )}
                                />

                                <Checkbox
                                    label="Show visibility map"
                                    color="dark"
                                    radius="xs"
                                    checked={options.verbose.show.visibility}
                                    onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => updateChecked("visibility", event.currentTarget.checked ) }
                                />

                                <Stack>
                                    <Checkbox
                                        label="Show solution"
                                        color="dark"
                                        radius="xs"
                                        checked={options.verbose.show.solution}
                                        onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => updateChecked("solution", event.currentTarget.checked )}
                                    />
                                        
                                    <Title order={6}>
                                        Opacities
                                    </Title>

                                    <Group style={{width: "100%"}}>
                                        <Text weight={500}>
                                            Frontier:
                                        </Text>
                                        <Slider style={{width: "60%", marginLeft: "auto"}}
                                            color="blue"
                                            size="sm"
                                            radius="xs"
                                            value={options.verbose.opacity.frontier}
                                            onChange={ (newOpacity: number) => updateOpacity("frontier", newOpacity) }
                                            />
                                    </Group>

                                    <Group style={{width: "100%"}}>
                                        <Text weight={500}>
                                            Explored:
                                        </Text>
                                        <Slider style={{width: "60%", marginLeft: "auto"}}
                                            color="cyan"
                                            size="sm"
                                            radius="xs"
                                            value={options.verbose.opacity.explored}
                                            onChange={ (newOpacity: number) => 
                                                updateOpacity("explored", newOpacity) }
                                            />
                                    </Group>


                                    <Group style={{width: "100%"}}>
                                        <Text weight={500}>
                                            Solution:
                                        </Text>
                                        <Slider style={{width: "60%", marginLeft: "auto"  }}
                                            color="red"
                                            size="sm"
                                            radius="xs"
                                            value={options.verbose.opacity.solution}
                                            onChange={ (newOpacity: number) => updateOpacity("solution", newOpacity) }
                                            />
                                    </Group>

                                    <Group style={{width: "100%"}}>
                                    <Text weight={500}>
                                        Visibility:
                                    </Text>
                                    <Slider style={{width: "60%", marginLeft: "auto"}}
                                        color="gray"
                                        size="sm"
                                        radius="xs"
                                        value={options.verbose.opacity.visibility}
                                        onChange={ (newOpacity: number) => updateOpacity("visibility", newOpacity) }
                                        />
                                    </Group>

                                </Stack>

                            </Stack>
                        </Accordion.Item>
                    </Accordion>

                    <Button color="dark" style={{marginTop: "0.5rem", alignSelf: "flex-start"}}
                        disabled={  polygons.length <= 0 || !startPoint || !destinationPoint ||
                                    polygons.reduce( ( currentVal: boolean, polygon: Polygon ) => currentVal || !polygon.isConvex || !!polygon.pointInside, false) ||
                                    !Object.keys(selectedAlgorithms).reduce( (currentVal: boolean, algo: string) => currentVal || selectedAlgorithms[algo as Algorithms], false )
                                }
                        onClick={ ()=> runAlgorithms(selectedAlgorithms) }>
                        Find path
                    </Button>
                </Stack>
                
            </ScrollArea>
        );
        
}

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsSelector);
