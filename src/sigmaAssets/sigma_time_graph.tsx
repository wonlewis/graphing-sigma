import {FC, useEffect, useState} from "react";
import Graph, {MultiDirectedGraph} from "graphology";
import "@react-sigma/core/lib/react-sigma.min.css";
import {
    ControlsContainer,
    FullScreenControl,
    SigmaContainer,
    useLoadGraph, useRegisterEvents, useSigma,
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
    hidden: boolean;
    size: number;
    forceLabel: boolean;
    color: string;
    label: string;
    type: string;
    doc_count: number;
    duration: number;
    timestamp: Date;
}

type GraphAttributes = {
    name?: string;
}

const sigmaSettings = { allowInvalidContainer: true };

const MyGraph: FC = () => {
    const loadGraph = useLoadGraph();

    useEffect(() => {
        // Create the graph
        const graph: Graph<NodeAttributes, EdgeAttributes, GraphAttributes> = new Graph({multi: true, type: "directed"});
        graph.addNode("1", {x: 0, y: 0, size: 10, label: "object1", color: "red"})
        graph.addNode("2", {x: 0.1, y: 0.1, size: 10,  label: "object2", color: "blue"})
        graph.addNode("3", {x: 0.3, y: -0.1, size: 10,  label: "object3", color: "green"})
        graph.addDirectedEdge("1", "2", {hidden: false, size: 4, forceLabel: true, color: "red", label: "great connection", type: "arrow", doc_count: 1, duration: 10, timestamp: new Date('2015-01-01T12:10:30Z')})
        graph.addDirectedEdge("2", "3", {hidden: false, size: 4, forceLabel: true, color: "blue", label: "bad connection", type: "arrow", doc_count: 1, duration: 20, timestamp:  new Date('2015-01-02T12:10:30Z')})
        graph.addDirectedEdge("3", "1", {hidden: false, size: 4, forceLabel: true, color: "green", label: "neutral connection", type: "arrow", doc_count: 1, duration: 15, timestamp:  new Date('2015-01-03T12:10:30Z')})
        loadGraph(graph);
        loadGraph(graph);
    }, [loadGraph]);

    const registerEvents = useRegisterEvents();
    const sigma = useSigma();
    const [draggedNode, setDraggedNode] = useState<string | null>(null);
    useEffect(() => {
        console.log("register events");
        // Register the events
        registerEvents({
            // node events
            clickNode: (event) => console.log("clickNode", event.event, event.node, event.preventSigmaDefault),
            doubleClickNode: (event) => console.log("doubleClickNode", event.event, event.node, event.preventSigmaDefault),
            rightClickNode: (event) => console.log("rightClickNode", event.event, event.node, event.preventSigmaDefault),
            wheelNode: (event) => console.log("wheelNode", event.event, event.node, event.preventSigmaDefault),
            enterNode: (event) => console.log("enterNode", event.node),
            leaveNode: (event) => console.log("leaveNode", event.node),
            // edge events
            clickEdge: (event) => console.log("clickEdge", event.event, event.edge, event.preventSigmaDefault),
            doubleClickEdge: (event) => console.log("doubleClickEdge", event.event, event.edge, event.preventSigmaDefault),
            rightClickEdge: (event) => console.log("rightClickEdge", event.event, event.edge, event.preventSigmaDefault),
            wheelEdge: (event) => console.log("wheelEdge", event.event, event.edge, event.preventSigmaDefault),
            downEdge: (event) => console.log("downEdge", event.event, event.edge, event.preventSigmaDefault),
            enterEdge: (event) => console.log("enterEdge", event.edge),
            leaveEdge: (event) => console.log("leaveEdge", event.edge),
            // stage events
            clickStage: (event) => console.log("clickStage", event.event, event.preventSigmaDefault),
            doubleClickStage: (event) => console.log("doubleClickStage", event.event, event.preventSigmaDefault),
            rightClickStage: (event) => console.log("rightClickStage", event.event, event.preventSigmaDefault),
            wheelStage: (event) => console.log("wheelStage", event.event, event.preventSigmaDefault),
            downStage: (event) => console.log("downStage", event.event, event.preventSigmaDefault),
            // default mouse events
            click: (event) => console.log("click", event.x, event.y),
            doubleClick: (event) => console.log("doubleClick", event.x, event.y),
            wheel: (event) => console.log("wheel", event.x, event.y, event.delta),
            rightClick: (event) => console.log("rightClick", event.x, event.y),
            mousemove: (event) => console.log("mousemove", event.x, event.y),
            // default touch events
            touchup: (event) => console.log("touchup", event.touches),
            touchdown: (event) => console.log("touchdown", event.touches),
            touchmove: (event) => console.log("touchmove", event.touches),
            // sigma kill
            kill: () => console.log("kill"),
            resize: () => console.log("resize"),
            beforeRender: () => console.log("beforeRender"),
            afterRender: () => console.log("afterRender"),
            // sigma camera update
            updated: (event) => console.log("updated", event.x, event.y, event.angle, event.ratio),
            downNode: (e) => {
                setDraggedNode(e.node);
                sigma.getGraph().setNodeAttribute(e.node, "highlighted", true);
            },
            // On mouse move, if the drag mode is enabled, we change the position of the draggedNode
            mousemovebody: (e) => {
                if (!draggedNode) return;
                // Get new position of node
                const pos = sigma.viewportToGraph(e);
                sigma.getGraph().setNodeAttribute(draggedNode, "x", pos.x);
                sigma.getGraph().setNodeAttribute(draggedNode, "y", pos.y);

                // Prevent sigma to move camera:
                e.preventSigmaDefault();
                e.original.preventDefault();
                e.original.stopPropagation();
            },
            // On mouse up, we reset the autoscale and the dragging mode
            mouseup: () => {
                if (draggedNode) {
                    setDraggedNode(null);
                    sigma.getGraph().removeNodeAttribute(draggedNode, "highlighted");
                }
            },
            // Disable the autoscale at the first down interaction
            mousedown: () => {
                if (!sigma.getCustomBBox()) sigma.setCustomBBox(sigma.getBBox());
            },
        });
    }, [registerEvents, sigma, draggedNode]);



    return null;
};

export const MultiDirectedTimeGraphView: FC = () => {
    return (
        <SigmaContainer graph={MultiDirectedGraph}  style={{ height: "500px", width: "1200px" }} settings={sigmaSettings}>
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