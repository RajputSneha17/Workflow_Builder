import { useState } from "react";
import "./App.css";

const createNode = (type, label) => ({
  id: Date.now() + Math.random(),
  type,
  label,
  children: [],
});

export default function App() {
  const [workflow, setWorkflow] = useState({
    id: 1,
    type: "start",
    label: "Start",
    children: [],
  });

  const [popupNode, setPopupNode] = useState(null);
  const [history, setHistory] = useState([]);
  const [redo, setRedo] = useState([]);

  /* ---------- Helpers ---------- */
  const saveHistory = (data) => {
    setHistory((h) => [...h, JSON.parse(JSON.stringify(data))]);
    setRedo([]);
  };

  const updateTree = (node, id, updater) => {
    if (node.id === id) return updater(node);
    return {
      ...node,
      children: node.children.map((c) => updateTree(c, id, updater)),
    };
  };

  /* ---------- Add Nodes ---------- */
  const addAction = (id) => {
    saveHistory(workflow);
    setWorkflow((prev) =>
      updateTree(prev, id, (node) => ({
        ...node,
        children: [createNode("action", "Action")],
      }))
    );
    setPopupNode(null);
  };

  const addBranch = (id) => {
    saveHistory(workflow);
    setWorkflow((prev) =>
      updateTree(prev, id, (node) => ({
        ...node,
        children: [
          {
            ...createNode("branch", "If"),
            children: [createNode("action", "True")],
          },
          {
            ...createNode("branch", "Else"),
            children: [createNode("action", "False")],
          },
        ],
      }))
    );
    setPopupNode(null);
  };

  const addEnd = (id) => {
    saveHistory(workflow);
    setWorkflow((prev) =>
      updateTree(prev, id, (node) => ({
        ...node,
        children: [createNode("end", "End")],
      }))
    );
    setPopupNode(null);
  };

  /* ---------- Delete Node ---------- */
  const deleteNode = (id) => {
    saveHistory(workflow);

    const remove = (node) => {
      node.children = node.children.flatMap((c) => {
        if (c.id === id) return c.children;
        remove(c);
        return c;
      });
    };

    setWorkflow((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      remove(copy);
      return copy;
    });
  };

  /* ---------- Edit Label ---------- */
  const editLabel = (id, value) => {
    setWorkflow((prev) =>
      updateTree(prev, id, (node) => ({ ...node, label: value }))
    );
  };

  /* ---------- Undo / Redo ---------- */
  const undo = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    setRedo((r) => [...r, workflow]);
    setHistory((h) => h.slice(0, -1));
    setWorkflow(last);
  };

  const redoAction = () => {
    if (!redo.length) return;
    const next = redo[redo.length - 1];
    setRedo((r) => r.slice(0, -1));
    setHistory((h) => [...h, workflow]);
    setWorkflow(next);
  };

  /* ---------- Save ---------- */
  const saveWorkflow = () => {
    console.log("WORKFLOW DATA:", workflow);
    alert("Workflow logged in console");
  };

  /* ---------- Render ---------- */
  const Node = ({ node }) => (
    <div className="boxes">
      <div className="box" onClick={() => setPopupNode(node.id)}>
        <input
          value={node.label}
          onChange={(e) => editLabel(node.id, e.target.value)}
        />
        {node.id !== 1 && (
          <span className="delete" onClick={() => deleteNode(node.id)}>
            ✕
          </span>
        )}
      </div>

      {popupNode === node.id && node.type !== "end" && (
        <ul className="popup">
          <li onClick={() => addAction(node.id)}>Action</li>
          <li onClick={() => addBranch(node.id)}>Branch</li>
          <li onClick={() => addEnd(node.id)}>End</li>
        </ul>
      )}

      {node.children.length === 2 ? (
        <div className="branch-group">
          {node.children.map((c) => (
            <Node key={c.id} node={c} />
          ))}
        </div>
      ) : (
        node.children.map((c) => <Node key={c.id} node={c} />)
      )}
    </div>
  );

  return (
    <>
      <nav>
        <div className="heading">
          <h1>Workflow_Builder</h1>
        </div>
        <div className="nav-buttons">
          <button onClick={undo}>Undo</button>
          <button onClick={redoAction}>Redo</button>
          <button onClick={saveWorkflow}>Save</button>
        </div>
      </nav>

      <main>
        <Node node={workflow} />
      </main>
    </>
  );
}
