# **AlgoVision**

**AlgoVision** is a simple DSA visualizer made to understand how different
algorithms work step by step.

Deployment URL: https://algo-vison-nu.vercel.app/

Instead of just looking at the code, we can enter our own values and see
what the algorithm is doing at every step.

## **What can we do with AlgoVision?**

Currently, the project has:

- **Bubble Sort**
- **Merge Sort**
- **Binary Search**
- **BFS**
- **DFS**

### **Bubble Sort**

**Bubble Sort** shows how two nearby elements are compared and swapped when
they are in the wrong order.

The elements change their colors while the algorithm is running so it is
easy to understand what is happening.

### **Merge Sort**

**Merge Sort** shows how an array is divided into smaller parts and then
merged back in sorted order.

The visualization shows the different parts of the array while the
algorithm is running.

### **Binary Search**

For **Binary Search**, we can enter an array and a **target value**.

The visualizer shows how the search range changes and how the target is
found.

### **BFS**

**BFS** works on a generated binary tree.

We can enter our own node values and a **target value**. The visualizer then
shows how BFS visits the nodes level by level using a **queue**.

### **DFS**

**DFS** also uses the generated tree.

It shows how the nodes are visited one by one using **depth-first traversal**
and how the algorithm **backtracks** when required.

## **Controls**

The visualizer has a few controls to make it easier to follow the
algorithm.

- **Run** - starts the steps automatically
- **Pause** - pauses the execution
- **Previous** - goes to the previous step
- **Next** - moves to the next step
- **Reset** - starts the visualization again
- **Speed** - changes the execution speed

## **Input**

One of the main things in this project is that the user can enter their
**own values**.

For example, for a sorting algorithm we can enter:

```text
10 4 7 2 8 5

and then see how the algorithm sorts those values.

For Binary Search, we can also enter the target value.

For BFS and DFS, we can enter node values and select a target node.

Colors

Different colors are used during the visualization to show what is
happening.

For sorting:

Yellow - elements being compared
Red - elements being swapped
Green - elements that are sorted

For BFS and DFS:

Purple - node currently in the queue or stack
Yellow - current node
Green - visited node
Target - node that we are searching for
Technologies Used

This project was made using:

React
JavaScript
HTML
CSS
Vite
Running the Project

First install the packages:

npm install

Then start the project:

npm run dev

After that, open the localhost link shown in the terminal.

Usually it will be something like:

http://localhost:5173
Project Structure
dsa-visualizer/
│
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
Why I made this

I made this project to make DSA algorithms easier to understand.

Sometimes it is difficult to understand an algorithm just by reading the
code. Seeing every comparison, swap, traversal and step makes the logic
much easier to follow.

Future Updates

I may add more algorithms and data structures in the future, such as:

Quick Sort
Insertion Sort
Selection Sort
Heap Sort
Linked List
Stack
Queue
Binary Search Tree
More graph algorithms
Author

Manideep
