import React, { Dispatch, useState } from 'react';
import { Stack, Checkbox, Button, Modal, Accordion, Slider, Title, Group, Text, ScrollArea, NativeSelect, NumberInput } from '@mantine/core';
import { InputWrapper } from '@mantine/core';
import { connect } from 'react-redux';
import { runAlgorithms } from './onRun';
import { store } from '../../Redux/Store/store';

import { makeRandomScene, RandomSceneProps } from '../RandomScene/MakeRandomPolygons';
import { setRandomizationStatus } from '../RandomScene/Actions/setRandomizationState';
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
        randomizationStatus: state.randomizationState,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        updateOptions: ( options: RunningOptions ) : void => dispatch( updateRunningOptions(options) ), 
        makeRandomScene: ( props: RandomSceneProps ) : void => dispatch( makeRandomScene(props) ),
        setRandomizationStatus: ( props: 'DONE' | 'PENDING' | undefined ): void => dispatch( setRandomizationStatus(props) ),
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
    setRandomizationStatus: (props: 'DONE' | 'PENDING' | undefined) => void,
    randomizationStatus?: "DONE" | "PENDING" | undefined,
}

const data = [
    { value: Algorithms.BFS, label: 'Breadth Frist' },
    { value: Algorithms.DFS, label: 'Depth First' },
    { value: Algorithms.UC, label: 'Uniform cost' },
    { value: Algorithms.ID, label: 'Iterative Deepening' },
    { value: Algorithms.AStar, label: 'A*' },
  ];

const AlgorithmsSelector: React.FC<AlgorithmsSelectorProps> = ({ usageMode, polygons, options, startPoint, destinationPoint, randomizationStatus, updateOptions, makeRandomScene, setRandomizationStatus }) => {
    
    const [ selectedAlgorithms, setSelectedAlgorithms ] = useState<SelectedAlgorithms>(makeEmptySelectedAlgorithms());
    const [ randomPolygonsCnt, setRandomPolygonsCnt ] = useState<number>(2);
    const [ minRandPolyCentersDist, setMinRandPolyCentersDist ] = useState<number>(21);
    const [ maxVerticesCnt, setMaxVerticesCnt ] = useState<number>(3);
    const [ forceMaxVertices, setForceMaxVertices ] = useState<boolean>(false);
    const [ p, setP ] = useState<number>(2);

    const [ isModalOpen, setModalOpen] = useState<boolean>(false);

    const updateChecked = ( key: "frontier" | "explored" | "solution" | "visibility" | "hitboxes" | "randomPolygonCircles", checked: boolean ) => {
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

    const updateOpacity = ( key: "frontier" | "explored" | "solution" | "visibility" | "hitboxes" | "randomPolygonCircles", opacity: number ) => {
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
            <>
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

                    {
                        selectedAlgorithms.AStar &&
                        <InputWrapper
                            style={{marginTop: '0.5rem'}}
                            label="P-distance Heuristic"
                            description="Set the distance to use as heuristic for A*. Default value is 2."
                        >
                            <NumberInput placeholder="p" min={1}
                                value={p} 
                                onChange={(value) => setP(value || 2)}
                            />
                            
                        </InputWrapper>
                    }
                    <Stack justify="flex-start" spacing="xs" style={{ marginTop: '1.25rem' }}>
                        <Button color="dark" style={{alignSelf: "flex-start"}}
                            disabled={  polygons.length <= 0 || !startPoint || !destinationPoint ||
                                        polygons.reduce( ( currentVal: boolean, polygon: Polygon ) => currentVal || !polygon.isConvex || !!polygon.pointInside || polygon.overlappingPolygonsID.length > 0, false) ||
                                        !Object.keys(selectedAlgorithms).reduce( (currentVal: boolean, algo: string) => currentVal || selectedAlgorithms[algo as Algorithms], false )
                                    }
                            onClick={ ()=> runAlgorithms(selectedAlgorithms, p < 0 ? 2:Math.floor(p) ) }>
                            Find path
                        </Button>

                        <Checkbox
                            label="Compute effective branching factor"
                            color="dark"
                            radius="xs"
                            checked={options.computeEBF}
                            onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => {
                                updateOptions( {...options, computeEBF: event.currentTarget.checked} )
                            }} 
                            />

                        <Button radius="sm" mt={2} mb={2}
                            onClick={ () => {
                                setRandomizationStatus('PENDING');
                                setModalOpen(true);
                            }}
                            
                            loading={randomizationStatus === 'PENDING'}
                            >
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

                                    <Checkbox
                                        label="Show solution"
                                        color="dark"
                                        radius="xs"
                                        checked={options.verbose.show.solution}
                                        onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => updateChecked("solution", event.currentTarget.checked )}
                                    />

                                    <Checkbox
                                        label="Show random circles"
                                        color="dark"
                                        radius="xs"
                                        checked={options.verbose.show.randomPolygonCircles}
                                        onChange={(event: React.ChangeEvent<Element & { checked: boolean }>) => updateChecked("randomPolygonCircles", event.currentTarget.checked )}
                                    />

                                    <Stack>
                                            
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

                                        <Group style={{width: "100%"}}>
                                            <Text weight={500}>
                                                Circles:
                                            </Text>
                                            <Slider style={{width: "60%", marginLeft: "auto"}}
                                                color="orange"
                                                size="sm"
                                                radius="xs"
                                                value={options.verbose.opacity.randomPolygonCircles}
                                                onChange={ (newOpacity: number) => updateOpacity("randomPolygonCircles", newOpacity) }
                                                />
                                        </Group>

                                    </Stack>

                                </Stack>
                            </Accordion.Item>
                        </Accordion>
                        
                    </Stack>
                    
                </ScrollArea>
                <Modal
                    opened={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    title="Select random scene options"
                >
                    <Stack>
                        <InputWrapper
                            required
                            label="Polygon number"
                            description="We'll try to generate the specified amount of random polygons if possible,
                                depending on the value of the other parameters."
                        >
                            <NumberInput placeholder="How many polygons should I generate?" min={2}
                                value={randomPolygonsCnt} 
                                onChange={(value) => setRandomPolygonsCnt(value || 2)}
                            />
                            
                        </InputWrapper>

                        <InputWrapper
                            required
                            label="Maximum vertices"
                            description="We'll generate polygons with at most the specified amount of vertices."
                        >
                            <NumberInput placeholder="How many polygons should I generate?" min={3}
                                value={maxVerticesCnt} 
                                onChange={(value) => setMaxVerticesCnt(value || 3)}
                            />
                        </InputWrapper>

                        <InputWrapper
                            required
                            label="Minimum circumcenters distance"
                            description="To generate random polygons we generate random circles first.
                                You can control the minimum distance between the
                                centers of such circles. Smaller circles means smaller polygons on average (min: 10)."
                        >
                            <NumberInput placeholder="How many polygons should I generate?" min={21}
                                value={minRandPolyCentersDist} 
                                onChange={(value) => setMinRandPolyCentersDist(value || 21)}
                            />
                        </InputWrapper>

                        <InputWrapper
                            required
                            description="If checked, this guarantees that at least one polygon with the specified
                                maximum amount of vertices is generated"
                        >
                            <Checkbox
                                label="Force maximum vertices"
                                checked={forceMaxVertices} onChange={(event)=> setForceMaxVertices(event.currentTarget.checked)}
                            />
                        </InputWrapper>
                        
                        <Group style={{borderTop: '1px solid rgba(0,0,0, 0.05)', paddingTop: '0.5rem'}}>
                            <Button color="grape" size="md" style={{marginLeft: 'auto'}}
                                disabled={randomPolygonsCnt < 2 || maxVerticesCnt < 3 || minRandPolyCentersDist < 21 }
                                onClick={() => {
                                    setModalOpen(false)
                                    makeRandomScene({
                                        polyCount: randomPolygonsCnt,
                                        minCircumcenterDist: minRandPolyCentersDist,
                                        maxVertices: maxVerticesCnt,
                                        forceMax: forceMaxVertices,
                                    })
                                }}
                                >
                                Confirm
                            </Button>
                        </Group>
                    </Stack>

                </Modal>

            </>
        );
        
}

export default connect(mapStateToProps, mapDispatchToProps)(AlgorithmsSelector);
