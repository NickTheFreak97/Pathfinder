import React from 'react';
import { ColorSwatch, Group, Title, Text } from '@mantine/core';

const Legend = () => {
    return <React.Fragment>
        <Title order={5} style={{
            marginTop: '1rem',
            marginBottom: '0.5rem'
        }}>Legend: </Title>

        <Group position="left" spacing="xs" direction="column">
            <Group spacing="md" direction="row">
                <ColorSwatch color={"rgb(203, 36, 49)"} />
                <Text weight={400}>Solution found by the algorithm.</Text>
            </Group>
            <Group spacing="md" direction="row">
                <ColorSwatch color={"rgba(0,128,128)"} />
                <Text weight={400}>Explored states list.</Text>
            </Group>
            <Group spacing="md" direction="row">
                <ColorSwatch color={"rgba(0,0,255)"} />
                <Text weight={400}>Nodes in the frontier.</Text>
            </Group>
            <Group spacing="md" direction="row">
                <ColorSwatch color={"#FF9933"} />
                <Text weight={400}>Shortest path when no obstacle is in the way and its intersection with obstacles.</Text>
            </Group>
        </Group>
    </React.Fragment>
}

export default Legend;