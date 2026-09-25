import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const ALGORITHMS = {
  bubble: {
    name: "Bubble Sort",
    category: "Sorting",
    icon: "↕",
    description: "Compare adjacent values and swap them when they are in the wrong order.",
    time: "O(n²)",
    space: "O(1)",
  },
  merge: {
    name: "Merge Sort",
    category: "Sorting",
    icon: "⇄",
    description: "Divide the array into smaller parts, then merge sorted parts together.",
    time: "O(n log n)",
    space: "O(n)",
  },
  binary: {
    name: "Binary Search",
    category: "Searching",
    icon: "⌕",
    description: "Repeatedly divide a sorted array to find the target value.",
    time: "O(log n)",
    space: "O(1)",
  },
  bfs: {
    name: "BFS",
    category: "Graph",
    icon: "◎",
    description: "Explore a graph level by level using a queue.",
    time: "O(V + E)",
    space: "O(V)",
  },
  dfs: {
    name: "DFS",
    category: "Graph",
    icon: "⌁",
    description: "Explore a graph deeply before backtracking.",
    time: "O(V + E)",
    space: "O(V)",
  },
};

const DEFAULT_VALUES = [10, 4, 7, 2, 8, 5];

function makeBlankArray(size) {
  return Array.from({ length: size }, () => "");
}

function makeRandomArray(size) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 90) + 10
  );
}

/* =========================================================
   BUBBLE SORT STEPS
========================================================= */

function createBubbleSteps(input) {
  const arr = [...input];
  const steps = [];

  steps.push({
    type: "start",
    array: [...arr],
    active: [],
    sorted: [],
    message: "Ready to start Bubble Sort.",
  });

  const sorted = [];

  for (let pass = 0; pass < arr.length - 1; pass++) {
    let swapped = false;

    for (let j = 0; j < arr.length - pass - 1; j++) {
      steps.push({
        type: "compare",
        array: [...arr],
        active: [j, j + 1],
        sorted: [...sorted],
        message: `Compare ${arr[j]} and ${arr[j + 1]}.`,
      });

      if (arr[j] > arr[j + 1]) {
        const left = arr[j];
        const right = arr[j + 1];

        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          type: "swap",
          array: [...arr],
          active: [j, j + 1],
          sorted: [...sorted],
          message: `Swap ${left} and ${right}.`,
        });
      }
    }

    sorted.unshift(arr.length - pass - 1);

    steps.push({
      type: "sorted",
      array: [...arr],
      active: [],
      sorted: [...sorted],
      message: `${arr[sorted[0]]} is now in its correct position.`,
    });

    if (!swapped) break;
  }

  const allSorted = Array.from({ length: arr.length }, (_, i) => i);

  steps.push({
    type: "done",
    array: [...arr],
    active: [],
    sorted: allSorted,
    message: "Bubble Sort completed.",
  });

  return steps;
}

/* =========================================================
   MERGE SORT STEPS
========================================================= */

function createMergeSteps(input) {
  const original = [...input];
  const steps = [];

  /*
    A segment:
    {
      start: number,
      values: number[],
      depth: number,
      state: "normal" | "active" | "merged"
    }
  */

  let tree = [
    {
      start: 0,
      values: [...original],
      depth: 0,
      state: "active",
    },
  ];

  steps.push({
    type: "start",
    array: [...original],
    tree: cloneTree(tree),
    active: [],
    sorted: [],
    message: "Start with the complete array.",
  });

  function divide(start, end, depth) {
    if (start === end) {
      return;
    }

    const mid = Math.floor((start + end) / 2);

    const left = original.slice(start, mid + 1);
    const right = original.slice(mid + 1, end + 1);

    tree = tree.map((segment) => ({
      ...segment,
      state:
        segment.start === start &&
        segment.values.length === end - start + 1
          ? "normal"
          : segment.state,
    }));

    tree.push({
      start,
      values: left,
      depth: depth + 1,
      state: "active",
    });

    tree.push({
      start: mid + 1,
      values: right,
      depth: depth + 1,
      state: "active",
    });

    steps.push({
      type: "divide",
      array: [...original],
      tree: cloneTree(tree),
      active: [],
      sorted: [],
      message: `Divide index ${start}–${end} into ${start}–${mid} and ${mid + 1}–${end}.`,
    });

    divide(start, mid, depth + 1);
    divide(mid + 1, end, depth + 1);
  }

  divide(0, original.length - 1, 0);

  let working = [...original];

  function mergeRange(left, mid, right, depth) {
    const leftArr = working.slice(left, mid + 1);
    const rightArr = working.slice(mid + 1, right + 1);

    steps.push({
      type: "compare",
      array: [...working],
      tree: cloneTree(tree),
      active: [],
      sorted: [],
      mergeInfo: {
        left: [...leftArr],
        right: [...rightArr],
      },
      message: `Compare the two sorted parts [${leftArr.join(
        ", "
      )}] and [${rightArr.join(", ")}].`,
    });

    const merged = [];
    let i = 0;
    let j = 0;

    while (i < leftArr.length && j < rightArr.length) {
      if (leftArr[i] <= rightArr[j]) {
        merged.push(leftArr[i]);

        steps.push({
          type: "take",
          array: [...working],
          tree: cloneTree(tree),
          active: [],
          sorted: [],
          mergeInfo: {
            left: [...leftArr],
            right: [...rightArr],
            selected: leftArr[i],
          },
          message: `Take ${leftArr[i]} from the left part.`,
        });

        i++;
      } else {
        merged.push(rightArr[j]);

        steps.push({
          type: "take",
          array: [...working],
          tree: cloneTree(tree),
          active: [],
          sorted: [],
          mergeInfo: {
            left: [...leftArr],
            right: [...rightArr],
            selected: rightArr[j],
          },
          message: `Take ${rightArr[j]} from the right part.`,
        });

        j++;
      }
    }

    while (i < leftArr.length) {
      merged.push(leftArr[i]);

      steps.push({
        type: "take",
        array: [...working],
        tree: cloneTree(tree),
        active: [],
        sorted: [],
        mergeInfo: {
          left: [...leftArr],
          right: [...rightArr],
          selected: leftArr[i],
        },
        message: `Add remaining ${leftArr[i]} from the left part.`,
      });

      i++;
    }

    while (j < rightArr.length) {
      merged.push(rightArr[j]);

      steps.push({
        type: "take",
        array: [...working],
        tree: cloneTree(tree),
        active: [],
        sorted: [],
        mergeInfo: {
          left: [...leftArr],
          right: [...rightArr],
          selected: rightArr[j],
        },
        message: `Add remaining ${rightArr[j]} from the right part.`,
      });

      j++;
    }

    for (let k = 0; k < merged.length; k++) {
      working[left + k] = merged[k];
    }

    tree = tree.filter(
      (segment) =>
        !(
          segment.start >= left &&
          segment.start <= right &&
          segment.start + segment.values.length - 1 <= right &&
          segment.depth >= depth
        )
    );

    tree.push({
      start: left,
      values: [...merged],
      depth: depth,
      state: "merged",
    });

    steps.push({
      type: "merge",
      array: [...working],
      tree: cloneTree(tree),
      active: [],
      sorted: [],
      message: `Merge into [${merged.join(", ")}].`,
    });
  }

  function mergeSort(left, right, depth) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    mergeSort(left, mid, depth + 1);
    mergeSort(mid + 1, right, depth + 1);

    mergeRange(left, mid, right, depth);
  }

  mergeSort(0, original.length - 1, 0);

  steps.push({
    type: "done",
    array: [...working],
    tree: [
      {
        start: 0,
        values: [...working],
        depth: 0,
        state: "merged",
      },
    ],
    active: [],
    sorted: Array.from({ length: working.length }, (_, i) => i),
    message: "Merge Sort completed.",
  });

  return steps;
}

function cloneTree(tree) {
  return tree.map((segment) => ({
    ...segment,
    values: [...segment.values],
  }));
}

/* =========================================================
   BINARY SEARCH
========================================================= */

function createBinarySteps(input, target) {
  const arr = [...input].sort((a, b) => a - b);
  const steps = [];

  let low = 0;
  let high = arr.length - 1;

  steps.push({
    type: "start",
    array: arr,
    active: [],
    low,
    high,
    mid: null,
    sorted: [],
    message: `Search for ${target} in the sorted array.`,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    steps.push({
      type: "compare",
      array: arr,
      active: [mid],
      low,
      high,
      mid,
      sorted: [],
      message: `Check middle value ${arr[mid]}.`,
    });

    if (arr[mid] === target) {
      steps.push({
        type: "found",
        array: arr,
        active: [mid],
        low,
        high,
        mid,
        sorted: [mid],
        message: `Found ${target} at index ${mid}.`,
      });

      return steps;
    }

    if (arr[mid] < target) {
      steps.push({
        type: "move",
        array: arr,
        active: [mid],
        low,
        high,
        mid,
        sorted: [],
        message: `${arr[mid]} is smaller than ${target}. Search the right half.`,
      });

      low = mid + 1;
    } else {
      steps.push({
        type: "move",
        array: arr,
        active: [mid],
        low,
        high,
        mid,
        sorted: [],
        message: `${arr[mid]} is larger than ${target}. Search the left half.`,
      });

      high = mid - 1;
    }
  }

  steps.push({
    type: "not-found",
    array: arr,
    active: [],
    low,
    high,
    mid: null,
    sorted: [],
    message: `${target} was not found.`,
  });

  return steps;
}

/* =========================================================
   BFS / DFS — TREE TRAVERSAL
========================================================= */

/*
  The values entered by the user are used as the node values.

  The tree is generated automatically as a binary tree using
  level-order / array representation:

        index 0
       /       \
    index 1   index 2
     /   \     /   \
   3     4   5     6

  For node i:
    left child  = 2*i + 1
    right child = 2*i + 2
*/

function buildValueTree(values) {
  const graph = {};

  for (let i = 0; i < values.length; i++) {
    graph[i] = [];

    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < values.length) {
      graph[i].push(left);
    }

    if (right < values.length) {
      graph[i].push(right);
    }
  }

  return graph;
}

/* =========================================================
   BFS / DFS STEPS
========================================================= */

function createGraphSteps(mode, values, target) {
  const graph = buildValueTree(values);
  const steps = [];
  const visited = [];
  const nodeValues = [...values];
  const targetNumber = Number(target);

  const startNode = 0;

  steps.push({
    type: "start",
    visited: [],
    current: null,
    neighbor: undefined,
    queue:
      mode === "bfs"
        ? [startNode]
        : [],
    stack:
      mode === "dfs"
        ? [startNode]
        : undefined,
    graph,
    nodeValues,
    target: targetNumber,
    found: false,
    message:
      mode === "bfs"
        ? `Start BFS from the root (${nodeValues[startNode]}) using a queue.`
        : `Start DFS from the root (${nodeValues[startNode]}) using depth-first traversal.`,
  });

  if (mode === "bfs") {
    const queue = [startNode];
    const seen = new Set([startNode]);

    while (queue.length) {
      const node = queue.shift();

      steps.push({
        type: "visit",
        visited: [...visited],
        current: node,
        neighbor: undefined,
        queue: [...queue],
        graph,
        nodeValues,
        target: targetNumber,
        found: false,
        message: `Remove ${nodeValues[node]} from the queue and visit it.`,
      });

      visited.push(node);

      if (nodeValues[node] === targetNumber) {
        steps.push({
          type: "found",
          visited: [...visited],
          current: node,
          neighbor: undefined,
          queue: [...queue],
          graph,
          nodeValues,
          target: targetNumber,
          found: true,
          message: `Found target ${targetNumber} at node ${node}. BFS stops.`,
        });
        return steps;
      }

      for (const next of graph[node]) {
        steps.push({
          type: "check",
          visited: [...visited],
          current: node,
          neighbor: next,
          queue: [...queue],
          graph,
          nodeValues,
          target: targetNumber,
          found: false,
          message: `Check child ${nodeValues[next]} of ${nodeValues[node]}.`,
        });

        if (!seen.has(next)) {
          seen.add(next);
          queue.push(next);

          steps.push({
            type: "discover",
            visited: [...visited],
            current: node,
            neighbor: next,
            queue: [...queue],
            graph,
            nodeValues,
            target: targetNumber,
            found: false,
            message: `Add ${nodeValues[next]} to the queue.`,
          });
        }
      }
    }
  } else {
    const stack = [startNode];
    const seen = new Set();

    while (stack.length) {
      const node = stack.pop();

      if (seen.has(node)) {
        continue;
      }

      seen.add(node);

      steps.push({
        type: "visit",
        visited: [...visited],
        current: node,
        neighbor: undefined,
        queue: [...stack],
        stack: [...stack],
        graph,
        nodeValues,
        target: targetNumber,
        found: false,
        message: `Pop ${nodeValues[node]} from the stack and visit it.`,
      });

      visited.push(node);

      if (nodeValues[node] === targetNumber) {
        steps.push({
          type: "found",
          visited: [...visited],
          current: node,
          neighbor: undefined,
          queue: [...stack],
          stack: [...stack],
          graph,
          nodeValues,
          target: targetNumber,
          found: true,
          message: `Found target ${targetNumber} at node ${node}. DFS stops.`,
        });
        return steps;
      }

      /*
        Push right first so that the left child is processed first
        when it is popped. This gives the normal preorder DFS:
        root → left → right.
      */
      const children = [...graph[node]].reverse();

      for (const next of children) {
        if (!seen.has(next)) {
          steps.push({
            type: "move",
            visited: [...visited],
            current: node,
            neighbor: next,
            queue: [...stack],
            stack: [...stack],
            graph,
            nodeValues,
            target: targetNumber,
            found: false,
            message: `Move from ${nodeValues[node]} to ${nodeValues[next]}. Push ${nodeValues[next]} onto the stack.`,
          });

          stack.push(next);

          steps.push({
            type: "push",
            visited: [...visited],
            current: node,
            neighbor: next,
            queue: [...stack],
            stack: [...stack],
            graph,
            nodeValues,
            target: targetNumber,
            found: false,
            message: `Push ${nodeValues[next]} onto the DFS stack.`,
          });
        }
      }
    }
  }

  steps.push({
    type: "not-found",
    visited: [...visited],
    current: null,
    neighbor: undefined,
    queue: [],
    stack: [],
    graph,
    nodeValues,
    target: targetNumber,
    found: false,
    message: `Target ${targetNumber} was not found in the tree.`,
  });

  return steps;
}

/* =========================================================
   MAIN APP
========================================================= */

export default function App() {
  const [algorithm, setAlgorithm] = useState("bubble");

  const [size, setSize] = useState(6);

  const [values, setValues] = useState(
    DEFAULT_VALUES.map(String)
  );

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [isRunning, setIsRunning] = useState(false);

  const [speed, setSpeed] = useState(650);

  const [target, setTarget] = useState("");

  // BFS / DFS use the same user-entered values as tree node values.
  // The tree structure is generated automatically from those values.
  const currentAlgorithm = ALGORITHMS[algorithm];

  const step = steps[currentStep];

  /* ---------------------------------------------------------
     AUTOMATIC RUN
  --------------------------------------------------------- */

  useEffect(() => {
    if (!isRunning) return;

    if (currentStep >= steps.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep((value) => value + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isRunning, currentStep, steps.length, speed]);

  /* ---------------------------------------------------------
     RESET WHEN ALGORITHM CHANGES
  --------------------------------------------------------- */
  /* ---------------------------------------------------------
     CHANGE ARRAY SIZE
  --------------------------------------------------------- */

  function changeSize(newSize) {
    const safeSize = Math.max(3, Math.min(14, newSize));

    setSize(safeSize);

    // IMPORTANT:
    // Every time size changes, ALL inputs become blank.
    setValues(makeBlankArray(safeSize));

    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
  }

  /* ---------------------------------------------------------
     INPUT CHANGE
  --------------------------------------------------------- */

  function updateValue(index, value) {
    if (value === "" || /^-?\d*$/.test(value)) {
      const updated = [...values];
      updated[index] = value;
      setValues(updated);

      setSteps([]);
      setCurrentStep(0);
      setIsRunning(false);
    }
  }

  /* ---------------------------------------------------------
     RANDOMIZE
  --------------------------------------------------------- */

  function randomize() {
    setValues(makeRandomArray(size).map(String));

    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
  }

  /* ---------------------------------------------------------
     VISUALIZE
  --------------------------------------------------------- */

  function visualize() {
    const numericValues = values.map(Number);

    if (
      values.length !== size ||
      values.some((value) => value === "") ||
      numericValues.some((value) => Number.isNaN(value))
    ) {
      alert(`Please enter all ${size} values.`);
      return;
    }

    let generated = [];

    if (algorithm === "bubble") {
      generated = createBubbleSteps(numericValues);
    }

    if (algorithm === "merge") {
      generated = createMergeSteps(numericValues);
    }

    if (algorithm === "binary") {
      if (target === "") {
        alert("Please enter a search target.");
        return;
      }

      generated = createBinarySteps(
        numericValues,
        Number(target)
      );
    }

    if (algorithm === "bfs" || algorithm === "dfs") {
      if (target === "") {
        alert("Please enter a target value.");
        return;
      }

      generated = createGraphSteps(
        algorithm,
        numericValues,
        target
      );
    }

    setSteps(generated);
    setCurrentStep(0);
    setIsRunning(false);

    setTimeout(() => {
      document
        .getElementById("visualization")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  }

  function nextStep() {
    if (!steps.length) return;

    setIsRunning(false);

    setCurrentStep((value) =>
      Math.min(value + 1, steps.length - 1)
    );
  }

  function previousStep() {
    if (!steps.length) return;

    setIsRunning(false);

    setCurrentStep((value) =>
      Math.max(value - 1, 0)
    );
  }

  function resetVisualization() {
    setIsRunning(false);
    setCurrentStep(0);
  }

  function toggleRun() {
    if (!steps.length) return;

    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
      setIsRunning(true);
      return;
    }

    setIsRunning((value) => !value);
  }

  return (
    <div className="app">

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">◆</div>

          <div>
            <div className="brand-name">
              AlgoVision
            </div>

            <div className="brand-subtitle">
              Interactive DSA Lab
            </div>
          </div>
        </div>

        <div className={`status-badge status-${isRunning ? "running" : step && currentStep >= steps.length - 1 ? "complete" : "ready"}`}>
          <span className="status-dot"></span>

          <span>
            {isRunning
              ? "RUNNING"
              : step && currentStep >= steps.length - 1
                ? "COMPLETED"
                : "READY"}
          </span> 
        </div>
      </header>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="page">

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="sidebar">

          <div className="section-number">
            01 &nbsp; SELECT ALGORITHM
          </div>

          <div className="algorithm-list">

            {Object.entries(ALGORITHMS).map(
              ([key, item]) => (
                <button
                  key={key}
                  className={`algorithm-item ${
                    algorithm === key ? "selected" : ""
                  }`}
                  onClick={() => {
                    setIsRunning(false);
                    setSteps([]);
                    setCurrentStep(0);
                    setAlgorithm(key);
                  }}
                >
                  <div className="algorithm-icon">
                    {item.icon}
                  </div>

                  <div className="algorithm-text">
                    <strong>{item.name}</strong>

                    <small>{item.category}</small>
                  </div>

                  {algorithm === key && (
                    <span className="selected-arrow">
                      →
                    </span>
                  )}
                </button>
              )
            )}

          </div>

          <div className="sidebar-about">

            <div className="about-title">
              ABOUT
            </div>

            <p>
              {currentAlgorithm.description}
            </p>

            <div className="complexity">

              <div>
                <span>TIME</span>
                <strong>
                  {currentAlgorithm.time}
                </strong>
              </div>

              <div>
                <span>SPACE</span>
                <strong>
                  {currentAlgorithm.space}
                </strong>
              </div>

            </div>

          </div>

        </aside>

        {/* ===================================================
            MAIN
        =================================================== */}

        <main className="main">

          {/* HERO */}

          <section className="hero">

            <div className="hero-label">
              ALGORITHM VISUALIZATION
            </div>

            <h1>
              See the algorithm.
              <br />
              <span>Understand the logic.</span>
            </h1>

            <p>
              Enter your own data and walk through
              every operation step by step.
            </p>

          </section>

          {/* =================================================
              ALGORITHM INFORMATION
          ================================================= */}

          <section className="algorithm-card">

            <div className="algorithm-card-left">

              <div className="algorithm-card-label">
                {currentAlgorithm.category}
              </div>

              <h2>
                {currentAlgorithm.name}
              </h2>

              <p>
                {currentAlgorithm.description}
              </p>

            </div>

            <div className="algorithm-complexity">

              <div>
                <span>TIME</span>
                <strong>
                  {currentAlgorithm.time}
                </strong>
              </div>

              <div>
                <span>SPACE</span>
                <strong>
                  {currentAlgorithm.space}
                </strong>
              </div>

            </div>

          </section>

          {/* =================================================
              INPUT
          ================================================= */}

          <section className="card input-card">

            <div className="card-heading">

              <div>
                <div className="section-number">
                  02
                </div>

                <h2>Input Data</h2>

                <p>
                  {algorithm === "bfs" || algorithm === "dfs"
                    ? "Enter node values. A binary tree is generated automatically."
                    : "Choose the size and enter your own values."}
                </p>
              </div>

              <button
                className="random-button"
                onClick={randomize}
              >
                ✦ Randomize
              </button>

            </div>

            <div className="input-controls">

              <div className="size-control">
                <label>
                  {algorithm === "bfs" || algorithm === "dfs"
                    ? "NUMBER OF NODES"
                    : "ARRAY SIZE"}
                </label>

                <div className="size-row">

                  <div className="size-selector">
                    <select
                      value={size}
                      onChange={(e) =>
                        changeSize(
                          Number(e.target.value)
                        )
                      }
                    >
                      {Array.from(
                        { length: 12 },
                        (_, i) => i + 3
                      ).map((number) => (
                        <option
                          key={number}
                          value={number}
                        >
                          {number}
                        </option>
                      ))}
                    </select>

                    <div className="size-arrows">

                      <button
                        type="button"
                        onClick={() =>
                          changeSize(size + 1)
                        }
                        aria-label="Increase size"
                      >
                        <span>▲</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          changeSize(size - 1)
                        }
                        aria-label="Decrease size"
                      >
                        <span>▼</span>
                      </button>

                    </div>
                  </div>

                  <span className="required-text">
                    {algorithm === "bfs" || algorithm === "dfs"
                      ? `${size} node values`
                      : `${size} values required`}
                  </span>

                  {(algorithm === "binary" ||
                    algorithm === "bfs" ||
                    algorithm === "dfs") && (
                    <div className="target-inline">
                      <label>
                        TARGET VALUE
                      </label>

                      <input
                        type="number"
                        value={target}
                        onChange={(e) =>
                          setTarget(e.target.value)
                        }
                        placeholder="Target"
                      />
                    </div>
                  )}

                </div>
              </div>

            </div>

            <div className="value-grid">

              {values.map((value, index) => (
                <div
                  className="value-input"
                  key={index}
                >
                  <label>
                    {algorithm === "bfs" ||
                    algorithm === "dfs"
                      ? `NODE ${index}`
                      : index}
                  </label>

                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      updateValue(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="Value"
                  />
                </div>
              ))}

            </div>

            {(algorithm === "bfs" ||
              algorithm === "dfs") && (
              <div className="tree-input-note">
                Tree structure is automatic:
                <strong> parent i → children 2i+1 and 2i+2</strong>.
                Traversal starts at the root and stops when the target is found.
              </div>
            )}

            <button
              className="visualize-button"
              onClick={visualize}
            >
              <span>▶</span>
              {algorithm === "bfs"
                ? "Visualize BFS"
                : algorithm === "dfs"
                ? "Visualize DFS"
                : "Visualize Algorithm"}
            </button>

          </section>

          {/* =================================================
              VISUALIZATION
          ================================================= */}

          <section
            className="card visualization-card"
            id="visualization"
          >

            <div className="visualization-heading">

              <div>

                <div className="section-number">
                  03
                </div>

                <h2>Visualization</h2>

                <p>
                  {currentAlgorithm.name} step-by-step
                  execution
                </p>

              </div>

              <div className="step-counter">
                STEP{" "}
                <strong>
                  {steps.length
                    ? currentStep + 1
                    : 0}
                </strong>{" "}
                /{" "}
                {steps.length}
              </div>

            </div>

{/* VISUAL AREA */}

<div className="visual-area">

  {/* Show empty state only when there is NO current step */}
  {!step && (
    <div className="empty-state">

      <div className="empty-icon">
        {currentAlgorithm.icon}
      </div>

      <h3>
        Ready to visualize
      </h3>

      <p>
        Enter your values and press
        "Visualize Algorithm".
      </p>

    </div>
  )}

  {/* Bubble Sort */}
  {step &&
    algorithm === "bubble" &&
    step.array && (
      <BubbleVisualization step={step} />
    )}

  {/* Merge Sort */}
  {step &&
    algorithm === "merge" &&
    step.array && (
      <MergeVisualization step={step} />
    )}

  {/* Binary Search */}
  {step &&
    algorithm === "binary" &&
    step.array && (
      <BinaryVisualization step={step} />
    )}

  {/* BFS / DFS */}
  {step &&
    (algorithm === "bfs" || algorithm === "dfs") &&
    step.graph && (
      <GraphVisualization step={step} />
    )}

</div>

            {/* CURRENT OPERATION */}

            {step && (
              <div className="operation-box">

                <div className="operation-label">
                  CURRENT OPERATION
                </div>

                <div className="operation-content">
                  {step.message}
                </div>

                <div className="operation-type">
                  {step.type}
                </div>

              </div>
            )}

            {/* CONTROLS */}

            <div className="controls">

              <button
                className="control-button"
                onClick={resetVisualization}
                disabled={!steps.length}
              >
                ↻ Reset
              </button>

              <button
                className="control-button"
                onClick={previousStep}
                disabled={
                  !steps.length ||
                  currentStep === 0
                }
              >
                ‹ Previous
              </button>

              <button
                className={`run-button ${
                  isRunning ? "running" : ""
                }`}
                onClick={toggleRun}
                disabled={!steps.length}
              >
                {isRunning ? (
                  <>
                    <span>Ⅱ</span>
                    Pause
                  </>
                ) : (
                  <>
                    <span>▶</span>
                    Run
                  </>
                )}
              </button>

              <button
                className="control-button"
                onClick={nextStep}
                disabled={
                  !steps.length ||
                  currentStep >=
                    steps.length - 1
                }
              >
                Next ›
              </button>

            </div>

            {/* SPEED */}

            <div className="speed-control">
              <div className="speed-label">
                <span className="speed-symbol">◈</span>
                <span>Speed</span>
              </div>

              <input
                type="range"
                min="100"
                max="1200"
                step="50"
                value={1300 - speed}
                onChange={(e) =>
                  setSpeed(1300 - Number(e.target.value))
                }
                aria-label="Animation speed"
              />

              <span className="speed-value">
                {speed <= 400
                  ? "Fast"
                  : speed <= 800
                  ? "Medium"
                  : "Slow"}
              </span>
            </div>

            {/* PROGRESS */}

          <div className="execution-progress">
            <div className="execution-progress-header">
              <div className="execution-progress-title">
                <span className="progress-icon">◈</span>
                <span>EXECUTION PROGRESS</span>
              </div>

              <div className="execution-progress-step">
                STEP {currentStep} / {steps.length}
              </div>
            </div>

            <div className="execution-progress-track">
              <div
                className="execution-progress-fill"
                style={{
                  width: `${steps.length > 0
                    ? (currentStep / steps.length) * 100
                    : 0}%`
                }}
              >
                <span className="progress-dot" />
              </div>
            </div>
          </div>

          </section>

        </main>
      </div>
    </div>
  );
}

/* =========================================================
   BUBBLE VISUALIZATION
========================================================= */

function BubbleVisualization({ step }) {
  return (
    <div className="bubble-view">

      <div className="visual-title">
        ARRAY
      </div>

      <div className="array-row">

        {step.array.map((value, index) => {

          let className = "array-box";

          if (step.sorted?.includes(index)) {
            className += " sorted";
          }

          if (step.active?.includes(index)) {
            if (step.type === "compare") {
              className += " comparing";
            }

            if (step.type === "swap") {
              className += " swapping";
            }
          }

          return (
            <div
              className={className}
              key={index}
            >
              <strong>{value}</strong>
            </div>
          );
        })}

      </div>

      <div className="index-row">

        {step.array.map((_, index) => (
          <span key={index}>
            {index}
          </span>
        ))}

      </div>

      {step.active?.length === 2 && (
        <div className="comparison-area">

          <div
            className={`compare-box ${
              step.type === "swap"
                ? "red"
                : "yellow"
            }`}
          >
            {step.array[step.active[0]]}
          </div>

          <span className="vs">
            VS
          </span>

          <div
            className={`compare-box ${
              step.type === "swap"
                ? "red"
                : "yellow"
            }`}
          >
            {step.array[step.active[1]]}
          </div>

        </div>
      )}

      <div className="legend">

        <span>
          <i className="dot yellow"></i>
          Comparing
        </span>

        <span>
          <i className="dot red"></i>
          Swapping
        </span>

        <span>
          <i className="dot green"></i>
          Sorted
        </span>

      </div>

    </div>
  );
}

/* =========================================================
   MERGE VISUALIZATION
========================================================= */

function MergeVisualization({ step }) {
  const tree = step.tree || [];

  const maxDepth = tree.length
    ? Math.max(
        ...tree.map(
          (segment) => segment.depth
        )
      )
    : 0;

  const rows = [];

  for (
    let depth = 0;
    depth <= maxDepth;
    depth++
  ) {
    rows.push(
      tree.filter(
        (segment) => segment.depth === depth
      )
    );
  }

  return (
    <div className="merge-view">

      <div className="visual-title">
        MERGE SORT STEPS
      </div>

      {/* ORIGINAL ARRAY */}

      <div className="merge-original">

        {step.array.map((value, index) => (
          <div
            className="merge-box"
            key={index}
          >
            <strong>{value}</strong>
            <small>{index}</small>
          </div>
        ))}

      </div>

      {/* TREE */}

      <div className="merge-tree">

        {rows.map(
          (segments, depth) => (

            <div
              className="merge-tree-row"
              key={depth}
            >

              {segments.map(
                (segment, index) => (

                  <div
                    className={`merge-segment ${
                      segment.state ===
                      "active"
                        ? "active"
                        : ""
                    } ${
                      segment.state ===
                      "merged"
                        ? "merged"
                        : ""
                    }`}
                    key={`${depth}-${index}-${segment.start}`}
                  >

                    {segment.values.map(
                      (value, i) => (
                        <div
                          className="merge-value"
                          key={i}
                        >
                          <strong>
                            {value}
                          </strong>

                          <small>
                            {segment.start +
                              i}
                          </small>
                        </div>
                      )
                    )}

                  </div>

                )
              )}

            </div>

          )
        )}

      </div>

      {/* COMPARE / TAKE */}

      {step.mergeInfo && (
        <div className="merge-comparison">

          <div className="merge-part">

            <span>LEFT</span>

            <div>
              {step.mergeInfo.left.map(
                (value, index) => (
                  <b key={index}>
                    {value}
                  </b>
                )
              )}
            </div>

          </div>

          <div className="merge-vs">
            {step.type === "take"
              ? "→"
              : "VS"}
          </div>

          <div className="merge-part">

            <span>RIGHT</span>

            <div>
              {step.mergeInfo.right.map(
                (value, index) => (
                  <b key={index}>
                    {value}
                  </b>
                )
              )}
            </div>

          </div>

          {step.mergeInfo.selected !==
            undefined && (
            <div className="selected-value">
              Selected:{" "}
              <strong>
                {step.mergeInfo.selected}
              </strong>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

/* =========================================================
   BINARY SEARCH VISUALIZATION
========================================================= */

function BinaryVisualization({ step }) {
  return (
    <div className="binary-view">

      <div className="visual-title">
        SORTED ARRAY
      </div>

      <div className="array-row">

        {step.array.map((value, index) => {

          let className =
            "array-box binary-box";

          if (
            step.low !== undefined &&
            step.high !== undefined &&
            (index < step.low ||
              index > step.high)
          ) {
            className += " eliminated";
          }

          if (step.active?.includes(index)) {
            className += " comparing";
          }

          if (step.sorted?.includes(index)) {
            className += " sorted";
          }

          return (
            <div
              className={className}
              key={index}
            >
              <strong>{value}</strong>
            </div>
          );
        })}

      </div>

      <div className="index-row">

        {step.array.map((_, index) => (
          <span key={index}>
            {index}
          </span>
        ))}

      </div>

      {step.mid !== null &&
        step.mid !== undefined && (
          <div className="binary-info">
            Middle index:{" "}
            <strong>{step.mid}</strong>
          </div>
        )}

    </div>
  );
}

/* =========================================================
   GRAPH VISUALIZATION
========================================================= */

function GraphVisualization({ step }) {
  const graph = step.graph || {};
  const nodeValues = step.nodeValues || [];
  const nodes = Object.keys(graph).map(Number);

  const edges = [];

  nodes.forEach((from) => {
    (graph[from] || []).forEach((to) => {
      edges.push([from, to]);
    });
  });

  /*
    Position the nodes as an actual binary tree instead of a circle.
    Level 0 = root
    Level 1 = two children
    Level 2 = four children, etc.
  */
  const positions = {};

  nodes.forEach((node) => {
    const level = Math.floor(
      Math.log2(node + 1)
    );

    const firstIndexAtLevel =
      Math.pow(2, level) - 1;

    const indexInLevel =
      node - firstIndexAtLevel;

    const nodesAtLevel =
      Math.pow(2, level);

    positions[node] = [
      ((indexInLevel + 0.5) /
        nodesAtLevel) *
        100,
      12 + level * 25,
    ];
  });

  const frontier =
    step.queue ||
    step.stack ||
    [];

  const isDFS =
    step.stack !== undefined &&
    step.queue !== undefined;

  return (
    <div className="graph-view">

      <div className="visual-title">
        {isDFS
          ? step.found
            ? "DFS — TARGET FOUND"
            : "DFS TREE TRAVERSAL"
          : step.found
          ? "BFS — TARGET FOUND"
          : "BFS TREE TRAVERSAL"}
      </div>

      <div className="tree-target-info">
        TARGET:
        <strong>{step.target}</strong>
      </div>

      <div className="graph tree-graph">

        <svg
          className="graph-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {edges.map(([a, b]) => {

            const isActiveEdge =
              step.current !== null &&
              step.neighbor !== undefined &&
              step.current === a &&
              step.neighbor === b;

            return (
              <line
                key={`${a}-${b}`}
                x1={positions[a][0]}
                y1={positions[a][1]}
                x2={positions[b][0]}
                y2={positions[b][1]}
                className={
                  isActiveEdge
                    ? "graph-edge-active"
                    : ""
                }
              />
            );
          })}
        </svg>

        {nodes.map((node) => {

          const visited =
            step.visited?.includes(node);

          const current =
            step.current === node;

          const queued =
            frontier.includes(node);

          const found =
            step.found &&
            nodeValues[node] === step.target;

          const isNeighbor =
            step.neighbor === node &&
            !visited;

          let className =
            "graph-node";

          if (visited)
            className += " visited";

          if (queued)
            className += " queued";

          if (current)
            className += " current";

          if (isNeighbor)
            className += " neighbor";

          if (found)
            className += " found";

          return (
            <div
              key={node}
              className={className}
              style={{
                left:
                  `${positions[node][0]}%`,
                top:
                  `${positions[node][1]}%`,
              }}
            >
              <strong>
                {nodeValues[node]}
              </strong>

              <small>
                {node}
              </small>
            </div>
          );
        })}

      </div>

      <div className="queue-display">

        <span>
          {isDFS
            ? "STACK"
            : frontier.length
            ? "QUEUE"
            : "QUEUE EMPTY"}
        </span>

        <div>
          {frontier.map(
            (node, index) => (
              <b
                key={`${node}-${index}`}
              >
                {nodeValues[node]}
              </b>
            )
          )}

          {!frontier.length && (
            <small>Empty</small>
          )}
        </div>

      </div>

      <div className="graph-legend">

        <span>
          <i className="dot purple"></i>
          In Queue / Stack
        </span>

        <span>
          <i className="dot yellow"></i>
          Current
        </span>

        <span>
          <i className="dot green"></i>
          Visited
        </span>

        <span>
          <i className="dot target"></i>
          Target
        </span>

      </div>

    </div>
  );
}
  