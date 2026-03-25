import React, { useState, useCallback } from "react";
import BASE_URL from "./config";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import InputNode from "./InputNode";
import ResultNode from "./ResultNode";
import HistoryPanel from "./HistoryPanel";

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

function App() {
  const [prompt, setPrompt] = useState("");           
  const [response, setResponse] = useState("");       
  const [isLoading, setIsLoading] = useState(false);  
  const [statusMsg, setStatusMsg] = useState("");     
  const [showHistory, setShowHistory] = useState(false); 

  
  const initialNodes = [
    {
      id: "input-node",
      type: "inputNode",        
      position: { x: 80, y: 150 },
      data: {
        prompt: "",
        onPromptChange: () => {},  
      },
    },
    {
      id: "result-node",
      type: "resultNode",      
      position: { x: 520, y: 150 },
      data: {
        response: "",
        isLoading: false,
      },
    },
  ];

  const initialEdges = [
    {
      id: "edge-1",
      source: "input-node",    
      target: "result-node",   
      animated: true,           
      style: { stroke: "#38bdf8", strokeWidth: 2 },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  React.useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === "input-node") {
          return {
            ...node,
            data: {
              prompt: prompt,
              onPromptChange: (newPrompt) => setPrompt(newPrompt),
            },
          };
        }
        if (node.id === "result-node") {
          return {
            ...node,
            data: {
              response: response,
              isLoading: isLoading,
            },
          };
        }
        return node;
      })
    );
  }, [prompt, response, isLoading]); 

  const handleRunFlow = async () => {
    if (!prompt.trim()) {
      alert("Please type a prompt first!");
      return;
    }

    setIsLoading(true);
    setResponse(""); 
    setStatusMsg("");

    try {
      const res = await fetch(`${BASE_URL}/api/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.error) {
        setResponse("Error: " + data.error);
      } else {
        setResponse(data.response);
      }
    } catch (err) {
      setResponse("Failed to connect to the server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prompt || !response) {
      alert("Run the flow first before saving!");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/save`,  {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, response }),
      });

      const data = await res.json();

      if (data.message) {
        setStatusMsg("✅ Saved to database!");
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (err) {
      setStatusMsg("❌ Failed to save.");
    }
  };

  return (
    <div className="app-container">
      <div className="toolbar">
        <h1>⚡ AI Flow</h1>

        <button
          className="btn btn-run"
          onClick={handleRunFlow}
          disabled={isLoading}
        >
          {isLoading ? "Running..." : "▶ Run Flow"}
        </button>

        <button
          className="btn btn-save"
          onClick={handleSave}
          disabled={!response || isLoading}
        >
          💾 Save
        </button>

        <button
          className="btn btn-history"
          onClick={() => setShowHistory(!showHistory)}
        >
          📚 History
        </button>

        {statusMsg && <span className="status-msg">{statusMsg}</span>}
      </div>

      <div className="flow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#1e293b" gap={20} />
          <Controls />
        </ReactFlow>
      </div>

      {showHistory && (
        <HistoryPanel onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}

export default App;
