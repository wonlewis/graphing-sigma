import { FC, useEffect } from "react";
import Graph, {MultiDirectedGraph} from "graphology";
import "@react-sigma/core/lib/react-sigma.min.css";
import {
    ControlsContainer,
    FullScreenControl,
    SigmaContainer,
    useLoadGraph,
    ZoomControl
} from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import {CustomFullScreen} from "./custom_fullscreen.tsx";
import {TimelineControl} from "./timeline.tsx";

type NodeAttributes = {
    x: number;
    y: number;
    size: number;
    label: string;
    color: string;
}

type EdgeAttributes = {
    weight: number;
    timestamp: Date;
    type: string;
    label: string;
    color: string;
    forceLabel: boolean;
    size: number;
    hidden: boolean;
}

type GraphAttributes = {
    name?: string;
}

const MyGraph: FC = () => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
        // Create the graph
        const graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes> = new Graph({multi: true, type: "directed"});
        graph.addNode("Martha", {x: 0, y: 0, size: 10, label: "Martha", color: "red"})
        graph.addNode("Tomlinson", {x: 0.1, y: 0.1, size: 10,  label: "Tomlinson", color: "blue"})
        graph.addNode("Johnny", {x: 0.2, y: 0.2, size: 10,  label: "Johnny", color: "green"})
        graph.addNode("English", {x: 0.3, y: 0.3, size: 10,  label: "English", color: "orange"})
        graph.addDirectedEdge("Martha", "Tomlinson", {hidden: false, size: 4, forceLabel: true, color: "red", label: "haha", type: "arrow", weight: 10, timestamp: new Date('01 Jan 1970 00:00:00 GMT+0730')})
        graph.addDirectedEdge("Johnny", "Martha", {hidden: false, size: 4, forceLabel: true, color: "blue", label: "haha", type: "arrow", weight: 1, timestamp:  new Date('01 Jan 1971 00:00:00 GMT+0730')})
        loadGraph(graph);
    }, [loadGraph]);

    return null;
};

export const MultiDirectedTimeGraphView: FC = () => {
    return (
        <SigmaContainer graph={MultiDirectedGraph}  style={{ height: "500px", width: "1200px" }} >
            <ControlsContainer>
                <TimelineControl/>
                <ZoomControl/>
                <FullScreenControl>
                    <CustomFullScreen/>
                    <CustomFullScreen/>
                </FullScreenControl>
                <MyGraph />
            </ControlsContainer>
        </SigmaContainer>
    );
};