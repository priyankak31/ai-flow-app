import React from "react";
import { Handle, Position } from "@xyflow/react";

function InputNode({ data }) {
  return (
    <div className="custom-node input-node">
      <div className="node-label">📝 Your Prompt</div>

      <textarea
        rows={4}
        placeholder="Type your question here... e.g. What is the capital of France?"
        value={data.prompt}
        onChange={(e) => data.onPromptChange(e.target.value)}
      />

      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default InputNode;
