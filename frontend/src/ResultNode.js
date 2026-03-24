import React from "react";
import { Handle, Position } from "@xyflow/react";

function ResultNode({ data }) {
  return (
    <div className="custom-node result-node">
      <div className="node-label">🤖 AI Response</div>

      <div className="response-text">
        {data.isLoading ? (
          <span className="loading-text">Thinking...</span>
        ) : data.response ? (
          data.response
        ) : (
          <span className="placeholder">
            AI response will appear here after you click "Run Flow"
          </span>
        )}
      </div>
   
      <Handle type="target" position={Position.Left} />
    </div>
  );
}

export default ResultNode;
