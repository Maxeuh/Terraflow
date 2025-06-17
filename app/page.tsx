import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

export default function Home() {
    return (
        <div style={{ width: "100vw", height: "calc(100vh - 56px)" }}>
            <ReactFlow colorMode={"system"}>
                <Controls />
                <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
        </div>
    );
}
