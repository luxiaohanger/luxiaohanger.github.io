function hasLatex(value) {
	return /\\[A-Za-z]+|[_^{}]/.test(value);
}

function splitWithPattern(nodes, pattern) {
	const result = [];

	for (const node of nodes) {
		if (node.type !== 'text') {
			result.push(node);
			continue;
		}

		const value = node.value;
		let lastIndex = 0;
		let match;
		pattern.lastIndex = 0;

		while ((match = pattern.exec(value))) {
			const math = match[1].trim();
			if (match.index > lastIndex) {
				result.push({ type: 'text', value: value.slice(lastIndex, match.index) });
			}
			if (hasLatex(math)) {
				result.push({ type: 'inlineMath', value: math });
			} else {
				result.push({ type: 'text', value: match[0] });
			}
			lastIndex = pattern.lastIndex;
		}

		if (lastIndex < value.length) {
			result.push({ type: 'text', value: value.slice(lastIndex) });
		}
	}

	return result;
}

function splitInlineMath(value) {
	let nodes = [{ type: 'text', value }];
	nodes = splitWithPattern(nodes, /\\\((.+?)\\\)/gs);
	nodes = splitWithPattern(nodes, /\\?\[\s*([\s\S]*?\\[A-Za-z][\s\S]*?)\s*\\?\]/gs);
	nodes = splitWithPattern(nodes, /\(([^()\n]*\\[A-Za-z][^()\n]*)\)/gs);
	return nodes;
}

function transformInlineChildren(node) {
	if (!Array.isArray(node.children)) return;

	const children = [];
	for (const child of node.children) {
		if (child.type === 'text' && /\\\(|\\?\[|\([^()\n]*\\[A-Za-z]/.test(child.value)) {
			children.push(...splitInlineMath(child.value));
		} else {
			children.push(child);
		}
	}
	node.children = children;
}

function visit(node) {
	if (!node || typeof node !== 'object') return;

	if (node.type === 'paragraph' && Array.isArray(node.children)) {
		const text = node.children.map((child) => (child.type === 'text' ? child.value : '')).join('');
		const blockMatch = text.match(/^\s*\\?\[\s*(.+?)\s*\\?\]\s*$/s);
		if (blockMatch) {
			node.type = 'math';
			node.value = blockMatch[1].trim();
			delete node.children;
			return;
		}

		transformInlineChildren(node);
	} else {
		transformInlineChildren(node);
	}

	if (Array.isArray(node.children)) {
		for (const child of node.children) visit(child);
	}
}

export default function remarkLatexDelimiters() {
	return (tree) => visit(tree);
}
