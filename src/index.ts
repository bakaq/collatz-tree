// ================================
// === DOM and Aplication Stuff ===
// ================================

// SVG stuff
const svg = document.querySelector("#svg")! as SVGSVGElement;
const lines = svg.querySelector("#lines")!;
const svgNS = "http://www.w3.org/2000/svg";

// Draws initial tree
const tree = getTree(20);
drawTree(lines, tree);

// Connects the DOM
// TODO

// ============================
// === Implementation Stuff ===
// ============================

// Defines a node in the tree (graph?)
interface TreeNode {
	 value: number;
	 depth: number;
	 halfFrom?: TreeNode;
	 triple1From?: TreeNode;
}

// Gets a tree and calculates one more layer
function calculateNextDepth(tree: TreeNode, depth: number): TreeNode {
	if (tree.depth === depth) {
		// We're in the tips, calculate next branches
		tree.halfFrom = {
			value: tree.value * 2,
			depth: tree.depth + 1,
		};

		if (tree.value % 6 === 4) {
			tree.triple1From = {
				value: (tree.value-1) / 3,
				depth: tree.depth + 1,
			};
		}

		return tree;
	} else {
		// We're not yet in the tip, search further
		tree.halfFrom = calculateNextDepth(tree.halfFrom!, depth);

		if (typeof tree.triple1From !== "undefined") {
			tree.triple1From = calculateNextDepth(tree.triple1From, depth);
		}

		return tree;
	}
}

// Generates a tree of a given depth
function getTree(depth: number): TreeNode {
	switch (depth) {
		case 1:
			return {
				value: 1,
				depth: 1,
			};
		case 2:
			return {
				value: 1,
				depth: 1,
				halfFrom: {
					value: 2,
					depth: 2,
				},
			};
		case 3:
			return {
				value: 1,
				depth: 1,
				halfFrom: {
					value: 2,
					depth: 2,
					halfFrom: {
						value: 4,
						depth: 3,
					}
				},
			};
		case 4:
			// To avoid a recursive tree
			return {
				value: 1,
				depth: 1,
				halfFrom: {
					value: 2,
					depth: 2,
					halfFrom: {
						value: 4,
						depth: 3,
						halfFrom: {
							value: 8,
							depth: 4,
						},
					}
				},
			};
		default:
			// depth greater than 3
			return calculateNextDepth(getTree(depth - 1), depth - 1);
	}
}

// Draws the tree
function drawTree(g: Element, tree: TreeNode, len: number = 20) {
	if (typeof tree.halfFrom !== "undefined") {
		// Make the subgroup
		const subg = document.createElementNS(svgNS, "g");
		subg.setAttribute("class", "line-half");

		// Make a line
		const line = document.createElementNS(svgNS, "line") as SVGLineElement;

		line.setAttribute("x1", "0");
		line.setAttribute("y1", "0");
		line.setAttribute("x2", len.toString());
		line.setAttribute("y2", "0");
		line.setAttribute("stroke", "white");

		subg.appendChild(line);
		
		g.appendChild(subg);

		// Recurse
		drawTree(subg, tree.halfFrom, len);
	}

	if (typeof tree.triple1From !== "undefined") {
		// Make the subgroup
		const subg = document.createElementNS(svgNS, "g");
		subg.setAttribute("class", "line-triple");

		// Make a line
		const line = document.createElementNS(svgNS, "line") as SVGLineElement;

		line.setAttribute("x1", "0");
		line.setAttribute("y1", "0");
		line.setAttribute("x2", len.toString());
		line.setAttribute("y2", "0");
		line.setAttribute("stroke", "white");

		subg.appendChild(line);
		
		g.appendChild(subg);

		// Recurse
		drawTree(subg, tree.triple1From, len);
	}
}
