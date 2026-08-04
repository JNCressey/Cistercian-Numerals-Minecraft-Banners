import {COLOR, PATTERN, BANNER_SIDE, CistercianNumeralBannerGenerator} from "./cistercian-numerals-banner-generator.js";


/*
	assume the frontend html document has
		- <form id="generatorForm"> with inputs:
			- number "numberInput"
			- select "foregroundColor"
			- select "backgroundColor"
		- <h3 id="outputNumeralHeading">
		- <img id="cistercianNumeralOutput">
		- <div id="outputSectionLeft"> and <div id="outputSectionRight">, each with:
			- <h4 class="bannerSideHeading">
			- <textarea class="giveCommand">
			- <button class="copyCommandButton">
			- <ol class="craftingList">
			
			
*/


function toTitleCase(str) {
	return str
		.toLowerCase()
		.replace(/\b\w/g, c => c.toUpperCase());
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
	
	
	{ // heading
		const headingEl = document.getElementById("outputNumeralHeading");
		outputNumeralHeading(num, headingEl);
	}
	{ // numeral preview
		const cistercianNumeralOutputElement = document.getElementById("cistercianNumeralOutput");
		cistercianNumeralOutputElement.src = `./cistercian-numeral.svg?value=${num}`;
	}
	outputSide(num, generator, BANNER_SIDE.LEFT);
	outputSide(num, generator, BANNER_SIDE.RIGHT);
}

// #region updateOutput helpers
//{

/**
	@param {number} num
	@param {HTMLHeadingElement} headingEl The target heading to update.
*/
function outputNumeralHeading(num,headingEl){
	headingEl.textContent = `Output: for ${num}`;
}

/**
	@param {number} num
	@param {CistercianNumeralBannerGenerator} generator
	@param {BANNER_SIDE} side
*/
function outputSide(num, generator, side){
	const outputSectionId = {
		[BANNER_SIDE.LEFT]:  "outputSectionLeft",
		[BANNER_SIDE.RIGHT]: "outputSectionRight"
	}[side];
	
	{ // heading
		const headingEl = document.querySelector(`#${outputSectionId} .bannerSideHeading`);
		outputSideHeading(num, side, headingEl);
	}
	
	{ // banner preview
		const bannerPreview = document.querySelector(`#${outputSectionId} .bannerPreview`);
		outputBannerPreview(generator,side,bannerPreview);
	}
	
	{ // give command
		const giveCommandOutputArea = document.querySelector(`#${outputSectionId} .giveCommand`);
		outputGiveCommand(generator, side, giveCommandOutputArea);
	}
	
	{ // crafting list
		const craftingList = document.querySelector(`#${outputSectionId} .craftingList`);
		outputCraftingSteps(generator, side, craftingList);
	}
}


/**
	@param {number} num
	@param {BANNER_SIDE} side
	@param {HTMLHeadingElement} headingEl The target heading to update.
*/
function outputSideHeading(num, side, headingEl){
	const partialNum = {
		[BANNER_SIDE.LEFT]:  num - num%1000 + num%100 - num%10,
		[BANNER_SIDE.RIGHT]: num%1000 - num%100 + num%10
	}[side];
	headingEl.textContent=`${toTitleCase(objectKeyFromValue(BANNER_SIDE,side))} Banner: ${partialNum}`;
}


/**
	add the required crafting steps to the crafting list.
	@param {CistercianNumeralBannerGenerator} generator
	@param {BANNER_SIDE} side
	@param {HTMLImgElement} bannerPreview The target img to change the src of.
*/
function outputBannerPreview(generator,side,bannerPreview){
	const bannerSpecification = generator.getBannerSpecification(side);
	let urlParams = "";
	
	urlParams += `baseColor=${bannerSpecification.baseColor.toLowerCase()}`;
	
	bannerSpecification.patterns.forEach(({pattern,color},i)=>{
		const stepNumber = i+1;
		urlParams += `&pattern${stepNumber}=${pattern}&color${stepNumber}=${color.toLowerCase()}`
	});
	
	//const bannerSpecificationURLEncoded = encodeURIComponent(JSON.stringify(bannerSpecification));
	//bannerPreview.src = `./banner.svg?bannerSpecification=${bannerSpecificationURLEncoded}`;
	bannerPreview.src = `./banner.svg?${urlParams}`;
}

/**
	add the required crafting steps to the crafting list.
	@param {CistercianNumeralBannerGenerator} generator
	@param {BANNER_SIDE} side
	@param {HTMLTextAreaElement} giveCommandOutputArea The target area to put the give command.
*/
function outputGiveCommand(generator, side, giveCommandOutputArea){
	const giveCommand = generator.getCommandGiveBanner(side);
	giveCommandOutputArea.value = giveCommand;
}


/**
	add the required crafting steps to the crafting list.
	@param {CistercianNumeralBannerGenerator} generator
	@param {BANNER_SIDE} side
	@param {HTMLOListElement} craftingList The target list to add the steps to.
*/
function outputCraftingSteps(generator, side, craftingList){
	const bannerSpecification = generator.getBannerSpecification(side);
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
	
	// loom pattern steps
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

//}
// #endregion updateOutput helpers


/**
	@param {T} O
	@param {valueof T} p
	@return string
*/
function objectKeyFromValue(O,p){
	return Object.keys(O).find(k=>O[k] === p);
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

/**
	@param {string} sideSectionId The id of the target side section.
*/
function addCopyToClipboardFunctions(sideSectionId){
	/** @type {HTMLButtonElement}*/
	const copyCommandButtonElement = document.querySelector(`#${sideSectionId} .copyCommandButton`);
	/** @type {HTMLTextAreaElement} */
	const giveCommandOutputArea = document.querySelector(`#${sideSectionId} .giveCommand`);
	copyCommandButtonElement.addEventListener("click", ()=>navigator.clipboard.writeText(giveCommandOutputArea.value));
}


addColorOptionsToSelect(document.getElementById("foregroundColor"), COLOR.BLACK);
addColorOptionsToSelect(document.getElementById("backgroundColor"), COLOR.WHITE);
document.getElementById("generatorForm").addEventListener("submit", updateOutput);
["outputSectionLeft","outputSectionRight"].forEach(addCopyToClipboardFunctions);