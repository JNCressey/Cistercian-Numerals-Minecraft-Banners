import {COLOR, PATTERN, BANNER_SIDE, CistercianNumeralBannerGenerator} from "./cistercian-numerals-banner-generator.js";

/*
	assume the frontend html document has
		- <form id="generatorForm"> with inputs:
			- "numberInput"
			- "foregroundColor"
			- "backgroundColor"
		- <pre id="outputLeft">
		- <pre id="outputRight">
			
*/
		
function toTitleCase(str) {
	return str
		.toLowerCase()
		.replace(/\b\w/g, c => c.toUpperCase());
}

function indent(str) {
	return str.replace(/^/gm, "\t");
}

function updateOutput(e){
	e.preventDefault();   // stops the POST
	
	const formData = new FormData(e.target);
	const num = formData.get("numberInput");
	const colors = {
		foreground:formData.get("foregroundColor"),
		background:formData.get("backgroundColor")
	};
	
	console.log(colors);
	
	const generator = new CistercianNumeralBannerGenerator(num,colors);
	
	/**
		@param {PATTERN} p
		@return string
	*/
	function patternKeyFromValue(p){
		return Object.keys(PATTERN).find(k=>PATTERN[k] === p);
	}
	
	/**
		@param {BANNER_SIDE} side
		@return {string}
	*/
	function output(side){
		const giveCommand = generator.getCommandGiveBanner(side);
		const bannerSpecification = generator.getBannerSpecification(side);
		const patternSteps = 
			bannerSpecification
			.patterns
			.map(({color,pattern}) => 
				`${toTitleCase(color)} ${toTitleCase(patternKeyFromValue(pattern))}`
			);
		const stepList = 
			[
				`${toTitleCase(bannerSpecification.baseColor)} Banner`,
				...patternSteps
			]
			.map(i=>`- ${i}`)
			.join("\n");
		return `Give command:\n${giveCommand}\n\nSteps:\n${stepList}`;
	}
	
	document.getElementById("outputLeft").textContent = `# Left \n${indent(output(BANNER_SIDE.LEFT))}`;
	document.getElementById("outputRight").textContent = `# Right \n${indent(output(BANNER_SIDE.RIGHT))}`;
}

/**
	add the color options to a select element and set the default value.
	@param {HTMLSelectElement} selectEl The target element.
	@param {COLOR} defaultValue The default value to set.
*/
function addColorOptionsToSelect(selectEl, defaultValue){
	for (const color in COLOR){
		selectEl.appendChild(new Option(toTitleCase(color), color));
	}
	selectEl.value = defaultValue;
}

addColorOptionsToSelect(document.getElementById("foregroundColor"), COLOR.BLACK);
addColorOptionsToSelect(document.getElementById("backgroundColor"), COLOR.WHITE);
document.getElementById("generatorForm").addEventListener("submit", updateOutput);