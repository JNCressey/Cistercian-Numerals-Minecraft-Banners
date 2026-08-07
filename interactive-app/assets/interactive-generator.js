
import {COLOR, PATTERN} from "./banner-types.js";
import {BANNER_SIDE, CistercianNumeralBannerGenerator} from "./cistercian-numerals-banner-generator.js";
import {drawCistercianNumeral} from "./cistercian-numeral-draw-canvas.js";
import {drawBannerPreview} from "./banner-draw-canvas.js";

/*
	assume the frontend html document has
		- <form id="generatorForm"> with inputs:
			- number "numberInput"
			- select "foregroundColor"
			- select "backgroundColor"
		- <h3 id="outputNumeralHeading">
		- <canvas id="cistercianNumeralOutput">
		- <div id="outputSectionLeft"> and <div id="outputSectionRight">, each with:
			- <h4 class="bannerSideHeading">
			- <canvas class="bannerPreview">
			- <textarea class="giveCommand">
			- <button class="copyCommandButton">
			- <div class="craftingList"> containing a <table>
			
			
			
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
		drawCistercianNumeral(num, cistercianNumeralOutputElement);
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
		drawBannerPreview(generator.getBannerSpecification(side), bannerPreview);
	}
	
	{ // give command
		const giveCommandOutputArea = document.querySelector(`#${outputSectionId} .giveCommand`);
		outputGiveCommand(generator, side, giveCommandOutputArea);
	}
	
	{ // crafting list
		const craftingList = document.querySelector(`#${outputSectionId} .craftingList table`);
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
	headingEl.textContent=`${toTitleCase(side)} Banner: ${partialNum}`;
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
	@param {HTMLTableElement} craftingList The target list to add the steps to.
*/
function outputCraftingSteps(generator, side, craftingList){
	const bannerSpecification = generator.getBannerSpecification(side);
	craftingList.replaceChildren(); // Removes all child nodes
	
	{ // base banner
		const baseBannerTr = document.createElement("tr");
		{
			const baseBannerTh = document.createElement("th");
			baseBannerTh.textContent = `Start.`;
			baseBannerTr.append(baseBannerTh);
		}
		{
			const bannerNameTd = document.createElement("td");
			bannerNameTd.textContent = `${toTitleCase(bannerSpecification.baseColor.replaceAll("_"," "))} Banner`;
			baseBannerTr.append(bannerNameTd);
		}
		{
			const bannerImageTd = document.createElement("td");
			const bannerImage = document.createElement("img");
			bannerImage.src = `./assets/icons/${bannerSpecification.baseColor.replaceAll("_","-")}-banner.png`;
			bannerImageTd.append(bannerImage);
			baseBannerTr.append(bannerImageTd);
			
		}
		{
			//empty cells
			baseBannerTr.append(document.createElement("td"));
			baseBannerTr.append(document.createElement("td"));
		}
		craftingList.append(baseBannerTr);
	}
	
	// loom pattern steps
	bannerSpecification.patterns.forEach(({pattern,color},index) => {
		const craftStepTr = document.createElement("tr");
		{
			const craftStepTh = document.createElement("th");
			craftStepTh.textContent = `Step ${index+1}.`;
			craftStepTr.append(craftStepTh);
		}
		{
			const dyeColorTd = document.createElement("td");
			dyeColorTd.textContent = `${toTitleCase(color.replaceAll("_"," "))} Dye`;
			craftStepTr.append(dyeColorTd);
		}
		{
			const dyeImageTd = document.createElement("td");
			const dyeImage = document.createElement("img");
			dyeImage.src = `./assets/icons/${color.replaceAll("_","-")}-dye.png`;
			dyeImageTd.append(dyeImage);
			craftStepTr.append(dyeImageTd);
			
		}
		{
			const patternNameTd = document.createElement("td");
			patternNameTd.textContent = toTitleCase(pattern.name); 
			craftStepTr.append(patternNameTd);
		}
		{
			const patternImageTd = document.createElement("td");
			const patternImage = document.createElement("img");
			patternImage.src = `./assets/icons/${pattern.name.replaceAll(" ","-")}.png`;
			patternImageTd.append(patternImage);
			craftStepTr.append(patternImageTd);
			
		}
		craftingList.append(craftStepTr);
	});
	
}

//}
// #endregion updateOutput helpers


/**
	add the color options to a select element and set the default value.
	@param {HTMLSelectElement} selectEl The target element.
	@param {COLOR} defaultValue The default value to set.
*/
function addColorOptionsToSelect(selectEl, defaultValue){
	for (const color of Object.values(COLOR)){
		selectEl.appendChild(new Option(toTitleCase(color.replaceAll("_"," ")), color));
	}
	selectEl.value = defaultValue;
}


/**
	@param {string} sideSectionId The id of the target side section.
*/
function addFunctionsCopyToClipboard(sideSectionId){
	/** @type {HTMLButtonElement}*/
	const copyCommandButtonElement = document.querySelector(`#${sideSectionId} .copyCommandButton`);
	/** @type {HTMLTextAreaElement} */
	const giveCommandOutputArea = document.querySelector(`#${sideSectionId} .giveCommand`);
	copyCommandButtonElement.addEventListener("click", ()=>
		navigator.clipboard.writeText(giveCommandOutputArea.value)
	);
}


// #region input-change warning functions
//{

/**
	For when inputs change, set the warning if the give command output isn't empty.
	@param {HTMLButtonElement} copyCommandButtonElement
	@param {HTMLTextAreaElement} giveCommandOutputArea
*/
function addWarningChangedInput(copyCommandButtonElement, giveCommandOutputArea){
	if (giveCommandOutputArea.value !== "") {
		copyCommandButtonElement.classList.add("warningChangedInput");
	} else {
		copyCommandButtonElement.classList.remove("warningChangedInput");
	}
}


/**
	Remove the input change warning.
	@param {HTMLButtonElement} copyCommandButtonElement
*/
function removeWarningChangedInput(copyCommandButtonElement) {
	copyCommandButtonElement.classList.remove("warningChangedInput");
}


/**
	@param {string} sideSectionId The id of the target side section.
*/
function addFunctionsWarningChangedInput(sideSectionId){
	const generatorForm = document.getElementById("generatorForm");
	/** @type {HTMLButtonElement}*/
	const copyCommandButtonElement = document.querySelector(`#${sideSectionId} .copyCommandButton`);
	/** @type {HTMLTextAreaElement} */
	const giveCommandOutputArea = document.querySelector(`#${sideSectionId} .giveCommand`);
	generatorForm.addEventListener("input", ()=>
		addWarningChangedInput(copyCommandButtonElement, giveCommandOutputArea)
	);
	giveCommandOutputArea.addEventListener("input", ()=>
		addWarningChangedInput(copyCommandButtonElement, giveCommandOutputArea)
	);
	generatorForm.addEventListener("submit", ()=>
		removeWarningChangedInput(copyCommandButtonElement)
	);
	
}

//}
// #endregioninput-change warning functions

addColorOptionsToSelect(document.getElementById("foregroundColor"), COLOR.BLACK);
addColorOptionsToSelect(document.getElementById("backgroundColor"), COLOR.WHITE);
document.getElementById("generatorForm").addEventListener("submit", updateOutput);
["outputSectionLeft","outputSectionRight"].forEach(addFunctionsCopyToClipboard);
["outputSectionLeft","outputSectionRight"].forEach(addFunctionsWarningChangedInput);
