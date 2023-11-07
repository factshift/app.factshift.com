const simulation 	= d3.forceSimulation();
const updateLinks 	= linksManager.update;
const updateNodes 	= nodesManager.update;

const svg = 
	d3.select("svg#simulation")
		.attr('width', window.spwashi.parameters.width)
		.attr('height', window.spwashi.parameters.height)

let reinitCounter = 0;
const nodeContainer = [];
window.spwashi = window.spwashi || {};
window.spwashi.simulation = simulation;
window.spwashi.reinit = 
	() => {
		const nodes = nodesManager.init(nodeContainer, reinitCounter);
		const linkContainer = [];
		const links = linksManager.init([], nodes, reinitCounter);

		simulation.nodes(nodes);
		simulation.alphaTarget(0.1);
		simulation.force('link', d3.forceLink().links(links).strength(l => l.strength || 1));
		simulation.force('collide', d3.forceCollide(d => d.r));
		simulation.force('charge', d3.forceManyBody().strength(window.spwashi.parameters.forces.charge));
		simulation.force('center', d3.forceCenter(...CENTER_POS).strength(window.spwashi.parameters.forces.center));

		window.spwashi.tick = 
			() => {
				simulation.alphaTarget(0.1);
				simulation.alpha(.5);
				simulation.tick(1);
				window.spwashi.internalTicker();
			};

		window.spwashi.internalTicker =
			() => {
				updateLinks(links);
				updateNodes(nodes, zoom);
			};

		simulation.on('tick', window.spwashi.internalTicker);
		reinitCounter = reinitCounter + 1;
	};

window.spwashi.reinit();
