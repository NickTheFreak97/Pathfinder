import React, { Dispatch, useState, useEffect, useRef } from 'react';
import { Stack, Checkbox, Button, Accordion, Slider, Title, Group, Text, ScrollArea, NativeSelect } from '@mantine/core';
import { connect } from 'react-redux';
import { runAlgorithms } from './onRun';
import { store } from '../../Redux/Store/store';

import { makeRandomScene, RandomSceneProps } from '../RandomScene/MakeRandomPolygons';
import { State } from '../../GUIElements/Types/Redux/State';
import { InteractionMode } from '../../Utils/interactionMode';
import { Polygon } from '../../GUIElements/Types/Shapes/Polygon';
import { RunningOptions, updateRunningOptions } from './Types/RunningOptions';
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

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        updateOptions: ( options: RunningOptions ) : void => dispatch( updateRunningOptions(options) ), 
        makeRandomScene: ( props: RandomSceneProps ) : void => dispatch( makeRandomScene(props) )
    }
}

interface AlgorithmsSelectorProps {
    usageMode: InteractionMode,
    polygons: Polygon[],
    options: RunningOptions,
    startPoint: PointInfo | null | undefined,
    destinationPoint: PointInfo | null | undefined,
    updateOptions: (options: RunningOptions) => void,
    makeRandomScene: (props: RandomSceneProps) => void,
}

const data = [
    { value: Algorithms.BFS, label: 'Breadth Frist' },
    { value: Algorithms.DFS, label: 'Depth First' },
    { value: Algorithms.UC, label: 'Uniform cost' },
    { value: Algorithms.ID, label: 'Iterative Deepening' },
    { value: Algorithms.AStart, label: 'A*' },
  ];

const AlgorithmsSelector: React.FC<AlgorithmsSelectorProps> = ({ usageMode, polygons, options, startPoint, destinationPoint, updateOptions, makeRandomScene }) => {
    
    const containerRef = useRef<HTMLDivElement>(null);
    const [ selectedAlgorithms, setSelectedAlgorithms ] = useState<SelectedAlgorithms>(makeEmptySelectedAlgorithms());

    const updateChecked = ( key: "frontier" | "explored" | "solution" | "visibility" | "hitboxes", checked: boolean ) => {
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

    const updateOpacity = ( key: "frontier" | "explored" | "solution" | "visibility" | "hitboxes", opacity: number ) => {
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
            <div ref={containerRef}>
                <ScrollArea style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    flexBasis: "77%",
                    flexGrow: 0,
                    maxWidth: '250px',
                }}>
                    <NativeSelect
                        style={{
                            marginTop: '0.75rem'
                        }}
                        data={data}
                        radius="md"
                        onChange={ ( selected: React.ChangeEvent<HTMLSelectElement> ) => setSelectedAlgorithms( updateSelectedAlgorithms([selected.currentTarget.value]) ) }
                        label="Pick from this list"
                        placeholder="Pick the algorithms to run"
                        required
                    />

                    <Stack justify="flex-start" spacing="xs" style={{ marginTop: '1.25rem' }}>
                        <Checkbox
                            label="Compute effective branching factor"
                            color="dark"
                            radius="xs"
                            checked={options.computeEFB}
                            disabled={!selectedAlgorithms.AStar}
                            onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => {
                                updateOptions( {...options, computeEFB: event.currentTarget.checked} )
                            }} 
                            />

                        <Button radius="sm" mt={2} mb={2}
                            onClick={ () => {
                                makeRandomScene({
                                    polyCount: 30,
                                    minCircumcenterDist: 50,
                                    maxVertices: 7,
                                })  
                            }}>
                            Randomize
                        </Button>

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

                                    <Checkbox
                                        label="Show hitboxes"
                                        color="dark"
                                        radius="xs"
                                        checked={options.verbose.show.hitboxes}
                                        onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => updateChecked("hitboxes", event.currentTarget.checked ) }
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

                                        <Group style={{width: "100%"}}>
                                            <Text weight={500}>
                                                Hitboxes:
                                            </Text>
                                            <Slider style={{width: "60%", marginLeft: "auto"}}
                                                color="teal"
                                                size="sm"
                                                radius="xs"
                                                value={options.verbose.opacity.hitboxes}
                                                onChange={ (newOpacity: number) => updateOpacity("hitboxes", newOpacity) }
                                                />
                                        </Group>

                                    </Stack>

                                </Stack>
                            </Accordion.Item>
                        </Accordion>

                        <Button color="dark" style={{marginTop: "0.5rem", alignSelf: "flex-start"}}
                            disabled={  polygons.length <= 0 || !startPoint || !destinationPoint ||
                                        polygons.reduce( ( currentVal: boolean, polygon: Polygon ) => currentVal || !polygon.isConvex || !!polygon.pointInside || polygon.overlappingPolygonsID.length > 0, false) ||
                                        !Object.keys(selectedAlgorithms).reduce( (currentVal: boolean, algo: string) => currentVal || selectedAlgorithms[algo as Algorithms], false )
                                    }
                            onClick={ ()=> runAlgorithms(selectedAlgorithms) }>
                            Find path
                        </Button>
                    </Stack>
                    
                </ScrollArea>
            </div>
        );
        
}

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsSelector);
