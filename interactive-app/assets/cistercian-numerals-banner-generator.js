import {COLOR, PATTERN} from "./banner-types.js";


// #region constants
//{
	
function enumFromArray(A){
	return Object.freeze(
		A
		.reduce((o, k) => (o[k] = k.toLowerCase(), o), {})
	);
}


/**
	@enum{number}
*/
export const BANNER_SIDE = enumFromArray([
	"LEFT",
	"RIGHT",
]);

//}
// #endregion constants


// #region datatypes
//{

/**
	The color scheme to use for the two colors of the banner.
	@typedef {Object} ColorScheme
	@property {COLOR} foreground 
	@property {COLOR} background
*/


/**
	@typedef DigitParameters
	@property {number} exponent The exponent of base-10 for the place value.
	@property {number} faceValue The face value of the digit 0-9.
*/

//}
// #endregion data types


/**
	The banner color and the banner_patterns tag.
*/
class BannerSpecificationBuilder {
	/**
		@type {import('./banner-types.js').PatternsArray}
		The pattern elements 
	*/
	#patterns = [];
	
	
	/**
		@type {COLOR}
		The base color of the banner. May be set only once. 
	*/
	#baseColor;
	
	
	// #region fluent setters
	//{
	
	/**
		Set the base color of the banner. May be set only once.
		@param {COLOR} color
		@return {BannerSpecificationBuilder} this for chaining.
	*/
	setBaseColor(color){
		if (typeof this.#baseColor !== "undefined"){
			throw "baseColor is write-once";
		}
		this.#baseColor = color;
		
		return this; //for chaining
	};
	
	
	/**
		Add a pattern to the banner.
		@param {COLOR} patternColor
		@param {import('./banner-types.js').PatternEntry} patternShape
		@return {BannerSpecificationBuilder} this for chaining.
	*/
	add(patternColor, patternShape){
		this.#patterns.push(
			{pattern:patternShape, color:patternColor}
		);
		
		return this; //for chaining
	}
	
	//}
	// #endregion
	
	
	// #region getters
	//{
	
	/**
		@type {import('./banner-types.js').BannerSpecification}
	*/
	get bannerSpecification(){
		return {
			baseColor: this.#baseColor,
			patterns: this.#patterns
		};
	}
	
	
	get baseColor(){
		if (typeof this.#baseColor === "undefined"){
			throw "baseColor accessed before setting";
		}
		return this.#baseColor;
	}
	
	
	/**
		@type {string} The value for the banner_patterns tag.
	*/
	get banner_patterns(){
		const tagBody = (
			this.#patterns
				.map(
					({pattern,color}) => `{pattern:${pattern.tagId},color:${color}}`
				)
				.join(",")
		);
		return `[${tagBody}]`;
	}
	
	//}
	// #endregion getters
}


/**
	implementation of the banner patterns flowchart
	After creation, call START() and the required patterns will be applied to the target banner builder.
*/
class PatternGeneratorStateMachine {
	
	/**
		@type {DigitParameters}
		One of the two numbers to set. Only set if either is a 3. Always a 3.
	*/
	C;
	
	/**
		@type {DigitParameters}
		One of the two numbers to set. Only set if either is a 3. The non-3 digit if they're not equal.
	*/
	D;
	
	/**
		@param {DigitParameters} A One of the two numbers to set. The larger one if they're not equal.
		@param {DigitParameters} B One of the two numbers to set. The smaller one if they're not equal.
		@param {BANNER_SIDE} side
		@param {ColorScheme} colors
		@param {BannerSpecificationBuilder} banner The target banner builder to apply the patterns to.
	*/
	constructor(A, B, side, colors, banner){
		this.A      = A;
		this.B      = B;
		this.side   = side;
		this.colors = colors;
		this.banner = banner;
	}
	
	// implementation of the main flowchart
	// #region states
	//{
	
	// entry point for the flowchart.
	START(){
	
		switch(this.A.faceValue){
			case 8:
			case 9:
				this.banner.setBaseColor(this.colors.foreground);
				switch(this.B.faceValue){
					case 7:
						this.banner.add(
							this.colors.background,
							(this.B.exponent <2) 
								? PATTERN.PER_FESS 
								: PATTERN.PER_FESS_INVERTED
						);
						if(this.A.faceValue===8){
							this.banner.add(
								this.colors.foreground,
								PATTERN.BORDURE
							);
							this.runAuxiliaryFlowchartWith(this.A);
						} else { // A=9
							this.runAuxiliaryFlowchartWith(this.A);
							this.banner.add(
								this.colors.foreground,
								(this.side===BANNER_SIDE.RIGHT)
									? PATTERN.PALE_SINISTER
									: PATTERN.PALE_DEXTER
							);
						}
						return this.COLLECTION_4();
						
					case 8:
					case 9:
						if (this.A.faceValue===this.B.faceValue){
							this.banner.add(
								this.colors.background,
								(this.B.exponent <2)
									? PATTERN.CHIEF
									: PATTERN.BASE
							);
							this.runAuxiliaryFlowchartWith(this.A);
							return this.COLLECTION_4();
							
						} else { // digits are 9 & 8
							this.runAuxiliaryFlowchartWith(this.A);
							return this.COLLECTION_3();
							
						}
					
					default: // B<7
						return this.COLLECTION_1();
				}
				
			default: // A<8
				this.banner.setBaseColor(this.colors.background);
		
				if (this.A.faceValue!==3 && this.B.faceValue!==3){
					// neither digit is 3
					return this.COLLECTION_1();
				} else { // at least one of the values is 3
					[this.C,this.D] = ( // the two digits, with at least C being a 3.
						(this.A.faceValue===3) 
							? [this.A, this.B] 
							: [this.B, this.A]);
					this.runAuxiliaryFlowchartWith(this.C);
					switch(this.D.faceValue){
						case 3: // both digits are 3
							this.runAuxiliaryFlowchartWith(this.D);
							this.banner.add(this.colors.background, PATTERN.LOZENGE);
							return this.COLLECTION_5();
						
						case 7:
							this.banner
								.add(this.colors.background, PATTERN.LOZENGE)
								.add(this.colors.foreground, PATTERN.BORDURE);
							return this.COLLECTION_4();
						
						default:
							this.banner.add(this.colors.background, PATTERN.LOZENGE);
							this.runAuxiliaryFlowchartWith(this.D);
							if(this.D.faceValue==6) {
								return this.COLLECTION_4();
								
							} else {
								return this.COLLECTION_5();
								
							}
					}
				}
		}
		
	}
	
	
	COLLECTION_1(){
		this.runAuxiliaryFlowchartWith(this.A);
		if (
			(this.A.faceValue===this.B.faceValue) &&
			(this.A.faceValue===6 || this.A.faceValue===7)
		){
			return this.COLLECTION_4();
		} else {
			switch (this.A.faceValue){
				case 6:
					return this.COLLECTION_2();
					
				case 7:
				case 8:
				case 9:
					switch (this.B.faceValue) {
						case 2:
							return this.COLLECTION_3();
						
						case 0:
						case 1:
						case 5:
						case 6:
							return this.COLLECTION_2();
						
						case 3:
						case 4:
							this.banner.add(
								this.colors.background,
								(this.B.exponent <2)
									? PATTERN.PER_FESS
									: PATTERN.PER_FESS_INVERTED
							);
							this.runAuxiliaryFlowchartWith(this.B);
							return this.COLLECTION_5();
					}
				
				default: // A<6
					return this.COLLECTION_3();
			}
		}
	}
	
	
	COLLECTION_2(){
		this.banner.add(
			this.colors.background,
			(this.B.exponent <2)
				? PATTERN.PER_FESS
				: PATTERN.PER_FESS_INVERTED
		);
		return this.COLLECTION_3();
	}
	
	
	COLLECTION_3(){
		this.runAuxiliaryFlowchartWith(this.B);
		return this.COLLECTION_4();
	}
	
	
	COLLECTION_4(){
		this.banner.add(this.colors.background, PATTERN.FESS);
		return this.COLLECTION_5();
	}
	
	
	COLLECTION_5(){
		this.banner.add(
			this.colors.foreground,
			(this.side === BANNER_SIDE.RIGHT)
				? PATTERN.PALE_DEXTER
				: PATTERN.PALE_SINISTER
		);
		return true; //complete
	}
	
	//}
	// #endregion states
	
	
	// implementation of the auxiliary flowchart
	/**
		@param {DigitParameters} digitParameters One of the two numbers to set. This subroutine only depends on a singular digit, the caller choses which to pass to this argument.
	*/
	runAuxiliaryFlowchartWith(digitParameters){
		switch (digitParameters.faceValue){
			case 0:
				// core part of 0 is to leave pattern blank
				return;
			
			case 1:
				this.banner.add(
					this.colors.foreground,
					(digitParameters.exponent <2)
						? PATTERN.CHIEF
						: PATTERN.BASE
				);
				return;
			
			case 2:
				this.banner
					.add(
						this.colors.foreground,
						(digitParameters.exponent <2)
							? PATTERN.PER_FESS
							: PATTERN.PER_FESS_INVERTED
					)
					.add(
						this.colors.background,
						(digitParameters.exponent <2)
							? PATTERN.CHIEF
							: PATTERN.BASE
					);
				return;
			
			case 3:
				this.banner
					.add(
						this.colors.foreground,
						(digitParameters.exponent <2)
							? PATTERN.CHIEF_INDENTED
							: PATTERN.BASE_INDENTED
					)
					.add(
						this.colors.foreground,
						[
							PATTERN.CHIEF_SINISTER_CANTON,
							PATTERN.CHIEF_DEXTER_CANTON,
							PATTERN.BASE_SINISTER_CANTON,
							PATTERN.BASE_DEXTER_CANTON,
						][digitParameters.exponent]
					)
				return;
			
			case 4:
				this.banner
					.add(
						this.colors.foreground,
						(digitParameters.exponent <2)
							? PATTERN.INVERTED_CHEVRON
							: PATTERN.CHEVRON
					)
					.add(
						this.colors.background,
						[
							PATTERN.CHIEF_DEXTER_CANTON,
							PATTERN.CHIEF_SINISTER_CANTON,
							PATTERN.BASE_DEXTER_CANTON,
							PATTERN.BASE_SINISTER_CANTON,
						][digitParameters.exponent]
					);
				return;
			
			case 5:
				this.banner.add(
					this.colors.foreground,
					(digitParameters.exponent <2)
						? PATTERN.INVERTED_CHEVRON
						: PATTERN.CHEVRON
				);
				return;
			
			case 6:
				this.banner.add(
					this.colors.foreground,
					(this.side === BANNER_SIDE.RIGHT)
						? PATTERN.PALE_SINISTER
						: PATTERN.PALE_DEXTER
				);
				return;
			
			case 7:
				this.banner
					.add(this.colors.foreground, PATTERN.BORDURE)
					.add(
						this.colors.foreground,
						(this.side === BANNER_SIDE.RIGHT)
							? PATTERN.PALE_SINISTER
							: PATTERN.PALE_DEXTER
					);
				return;
			
			case 8:
				this.banner
					.add(
						this.colors.background,
						(digitParameters.exponent <2)
							? PATTERN.CHIEF
							: PATTERN.BASE
					)
					.add(
						this.colors.foreground,
						(this.side === BANNER_SIDE.RIGHT)
							? PATTERN.PALE_SINISTER
							: PATTERN.PALE_DEXTER
					);
				return;
			
			case 9:
				this.banner
					.add(
						this.colors.background,
						(digitParameters.exponent <2)
							? PATTERN.CHIEF
							: PATTERN.BASE
					)
					.add(this.colors.foreground, PATTERN.BORDURE);
				return;
		}
	}
}

// main class
export class CistercianNumeralBannerGenerator {
	
	/**
		@type {{[BANNER_SIDE.LEFT]:BannerSpecificationBuilder, [BANNER_SIDE.RIGHT]:BannerSpecificationBuilder}}
	*/
	#bannerSpecifications;
	
	constructor(num, colors){
		/**
			@type {number}
		*/
		this.num = num;
		
		/**
			@type {ColorScheme}
		*/
		this.colors = colors;
		
		
		this.buildBannerSpecifications();
	}
	
	
	// #region generation
	//{
	
	/**
		Generates the banner specifications for each side.
	*/
	buildBannerSpecifications(){
		this.#bannerSpecifications = {
			[BANNER_SIDE.LEFT]:  
				this.#generate_patterns_for_one_side(BANNER_SIDE.LEFT),
			[BANNER_SIDE.RIGHT]: 
				this.#generate_patterns_for_one_side(BANNER_SIDE.RIGHT)
		};
	}
	
	/**
		@param {BANNER_SIDE} side
		@returns {BannerSpecificationBuilder} The generated banner specification.
	*/
	#generate_patterns_for_one_side(side){
		// Parameters describing the two digits to make, with A having the larger face-value if they're unequal.
		const {
			/** @type {DigitParameters} */ larger:  A,
			/** @type {DigitParameters} */ smaller: B
		} = this.#getDigitParameters(side);
		
		const banner = new BannerSpecificationBuilder();
		const generatorStateMachine = (
			new PatternGeneratorStateMachine(A, B, side, this.colors, banner)
		);
		generatorStateMachine.START();
		return banner;
	}
	
	
	/**
		Get the parameters describing the two digits to make, with [larger] being the one with the larger face value if they are unequal.
		@param {BANNER_SIDE} side
		@return {larger:DigitParameters, smaller:DigitParameters}
	*/
	#getDigitParameters(side){
		/** 
			Get the face value of a single digit from a number (base-10).
			@param {number} exponent The exponent of base-10 for the place value.
			@return {number} The face value of the digit 0-9.
		*/
		const getFaceValueAt = (exponent)=>(Math.floor(this.num / 10 ** exponent) % 10);
		
		/** 
			Get the digit parameters for a single digit. 
			@param {number} exponent The exponent of base-10 for the place value.
			@return {DigitParameters}
		*/
		const getDigitParametersAt = (exponent)=>({exponent, faceValue:getFaceValueAt(exponent)});
		
		/**
			@type {[DigitParameters,DigitParameters]}
		*/
		const digitParameters = (
			{
				// left banner is for tens and thousands
				[BANNER_SIDE.LEFT]:  [getDigitParametersAt(1), getDigitParametersAt(3)],
				// right banner is for units and hundreds
				[BANNER_SIDE.RIGHT]: [getDigitParametersAt(0), getDigitParametersAt(2)]
			}
			[side]
		);
		
		const [larger, smaller] = digitParameters.sort((a,b)=>-(a.faceValue-b.faceValue)); //sort decending
		
		return {larger, smaller};
	}
	
	//}
	// #endregion generation
	
	
	/**
		@param {BANNER_SIDE} side
		@return {import('./banner-types.js').BannerSpecification}
	*/
	getBannerSpecification(side){
		const banner = this.#bannerSpecifications[side];
		return banner.bannerSpecification;
	}
	
	
	//# region minecraft commands
	//{

	/** 
		@param {BANNER_SIDE} side
		return {string}
	*/
	getCommandGiveBanner(side){
		const banner = this.#bannerSpecifications[side];
		const item = `minecraft:${banner.baseColor}_banner`;
		const tags = `custom_name="${this.num}",banner_patterns=${banner.banner_patterns}`;
		return `/give @p ${item}[${tags}] 1`;
	}


	/** 
		@param {BANNER_SIDE} side
		return {string}
	*/
	getCommandGiveShield(side){
		const banner = this.#bannerSpecifications[side];
		const tags = `base_color="${banner.baseColor}",banner_patterns=${banner.banner_patterns}`;
		return `/give @p minecraft:shield[${tags}] 1`;
	}


	/** 
		@param {BANNER_SIDE} side
		return {string}
	*/
	getCommandSummonArmorStand(side){
		const banner = this.#bannerSpecifications[side];
		const components = `{base_color:${banner.baseColor}, banner_patterns:${banner.banner_patterns}}`;
		const {equipmentHand,pose,rotation} = (
			(side === BANNER_SIDE.LEFT)
				? {
					equipmentHand:"mainhand",
					pose:"{RightArm:[270f,315f,0f]}",
					rotation:"[315f,0f]"
				}
				: { // right side banner
					equipmentHand:"offhand",
					pose:"{LeftArm:[270f,45f,0f]}",
					rotation:"[45f,0f]"
				}
		);
		return `/summon minecraft:armor_stand ~ ~ ~ {equipment:{${equipmentHand}:{id:"minecraft:shield",count:1, components:${components}}},ShowArms:1b,Pose:${pose},Rotation:${rotation}}`;
	}

	//}
	// # endregion minecraft commands
}


export function test(num){
	if (typeof num === "undefined") { num = 1337; }
	
	const colors = {foreground:COLOR.BLACK,background:COLOR.WHITE};
	
	const generator = new CistercianNumeralBannerGenerator(num,colors);
	
	
	const logOutputsForSide = (side)=>{
		console.log(generator.getBannerSpecification(side));
		console.log(generator.getCommandGiveBanner(side));
		console.log(generator.getCommandGiveShield(side));
		console.log(generator.getCommandSummonArmorStand(side));
	};
	
	console.log(`#banners for ${num}`);
	console.log("##left:");
	logOutputsForSide(BANNER_SIDE.LEFT);
	console.log("##right:");
	logOutputsForSide(BANNER_SIDE.RIGHT);
}

