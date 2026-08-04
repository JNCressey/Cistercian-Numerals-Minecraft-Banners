import {COLOR, PATTERN, BANNER_SIDE, CistercianNumeralBannerGenerator} from "./cistercian-numerals-banner-generator.js";


/*
	assume the frontend html document has
		- <form id="generatorForm"> with inputs:
			- number "numberInput"
			- select "foregroundColor"
			- select "backgroundColor"
		- <pre id="outputNumeralDetails">
		- <pre id="outputLeft">
		- <pre id="outputRight">
			
*/


function toTitleCase(str) {
	return str
		.toLowerCase()
		.replace(/\b\w/g, c => c.toUpperCase());
}

/**
	add the required crafting steps to the crafting list.
	@param {import("./cistercian-numerals-banner-generator.js").BannerSpecification} bannerSpecification
	@param {HTMLOListElement} craftingList The target list to add the steps to.
*/
function outputCraftingSteps(bannerSpecification, craftingList){
	craftingList.replaceChildren(); // Removes all child nodes
	
	{ // base banner
		const baseBannerLi = document.createElement("li");
		{
			const bannerName = document.createElement("span");
			bannerName.textContent = `${toTitleCase(bannerSpecification.baseColor)} Banner`;
			baseBannerLi.append(bannerName);
		}
		{
			const bannerImage = document.createElement("img");
			bannerImage.src = `./icons/${bannerSpecification.baseColor}-banner.png`;
			baseBannerLi.append(bannerImage);
			
		}
		craftingList.append(baseBannerLi);
	}
	
	
	bannerSpecification.patterns.forEach(({pattern,color}) => {
		const craftStepLi = document.createElement("li");
		{
			const dyeColor = document.createElement("span");
			dyeColor.textContent = `${toTitleCase(color)} Dye`;
			craftStepLi.append(dyeColor);
		}
		{
			const dyeImage = document.createElement("img");
			dyeImage.src = `./icons/${color}-dye.png`;
			craftStepLi.append(dyeImage);
			
		}
		{
			const patternName = document.createElement("span");
			patternName.textContent = `${toTitleCase(objectKeyFromValue(PATTERN,pattern))}`;
			craftStepLi.append(patternName);
		}
		{
			const patternImage = document.createElement("img");
			patternImage.src = `./icons/${pattern}.png`;
			craftStepLi.append(patternImage);
			
		}
		craftingList.append(craftStepLi);
	});
}

/**
	
	@param {HTMLDivElement} descriptionDiv
*/
function outputDescription(side, num, descriptionDiv){
	descriptionDiv.replaceChildren(); // Removes all child nodes
	
	{ // title
		/**
			@type {number} The number this banner represents. Either with units and hundreds, or with tens and thousands.
		*/
		const partialNum = {
			[BANNER_SIDE.LEFT]:  num - num%1000 + num%100 - num%10,
			[BANNER_SIDE.RIGHT]: num%1000 - num%100 + num%10
		}[side];
		const heading = document.createElement("h3");
		heading.textContent=`${toTitleCase(objectKeyFromValue(BANNER_SIDE,side))} Banner: ${partialNum}`;
		descriptionDiv.append(heading);
	}
}

/**
	@param {T} O
	@param {valueof T} p
	@return string
*/
function objectKeyFromValue(O,p){
	return Object.keys(O).find(k=>O[k] === p);
}
	

function updateOutput(e){
	e.preventDefault();   // stops the POST
	
	const formData = new FormData(e.target);
	const num = formData.get("numberInput");
	const colors = {
		foreground:formData.get("foregroundColor"),
		background:formData.get("backgroundColor")
	};
	
	const generator = new CistercianNumeralBannerGenerator(num,colors);
	
	/**
		@param {BANNER_SIDE} side
		@return {string}
	*/
	function preOutput(side){
		const giveCommand = generator.getCommandGiveBanner(side);
		const bannerSpecification = generator.getBannerSpecification(side);
		const patternSteps = 
			bannerSpecification
			.patterns
			.map(({color,pattern}) => 
				`${toTitleCase(color)} ${toTitleCase(objectKeyFromValue(PATTERN,pattern))}`
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
	document.getElementById("outputNumeralDetails").textContent = `# For number ${num}`;
	document.getElementById("outputLeft").textContent = `## Left \n${preOutput(BANNER_SIDE.LEFT)}`;
	document.getElementById("outputRight").textContent = `## Right \n${preOutput(BANNER_SIDE.RIGHT)}`;
	
	
	/**
		@param {BANNER_SIDE} side
	*/
	function listElementsOutput(side){
		{ // description
			const descriptionDivId = {
				[BANNER_SIDE.LEFT]:  "outputDescriptionLeft",
				[BANNER_SIDE.RIGHT]: "outputDescriptionRight"
			}[side];
			const descriptionDiv = document.getElementById(descriptionDivId);
			outputDescription(side, num, descriptionDiv);
		}
		
		{ // crafting list
			const outputListId = {
				[BANNER_SIDE.LEFT]:  "outputListLeft",
				[BANNER_SIDE.RIGHT]: "outputListRight"
			}[side];
			const bannerSpecification = generator.getBannerSpecification(side);
			const craftingList = document.getElementById(outputListId);
			outputCraftingSteps(bannerSpecification, craftingList);
		}
		
	}
	listElementsOutput(BANNER_SIDE.LEFT);
	listElementsOutput(BANNER_SIDE.RIGHT);
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

document.querySelectorAll('#generatorForm :disabled').forEach(function(el) {
	console.log(el);
	el.disabled = false;
});
document.getElementById("numberInput").value="";
addColorOptionsToSelect(document.getElementById("foregroundColor"), COLOR.BLACK);
addColorOptionsToSelect(document.getElementById("backgroundColor"), COLOR.WHITE);
document.getElementById("generatorForm").addEventListener("submit", updateOutput);