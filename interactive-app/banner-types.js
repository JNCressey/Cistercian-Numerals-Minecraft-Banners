
// #region datatypes
//{
	
/**
	The banner color and the banner_patterns tag.
	@typedef {Object} BannerSpecification
	@property {COLOR} baseColor
	@property {PatternsArray} patterns
*/


/**
	@typedef {Array.<{pattern:PatternEntry,color:COLOR}>} PatternsArray
*/

//}
// #endregion data types


//# region colors
//{

function enumFromArray(A){
	return Object.freeze(
		A
		.reduce((o, k) => (o[k] = k.toLowerCase(), o), {})
	);
}


/**
	Enum for the names of colors available.
	@enum{string}
*/
export const COLOR = enumFromArray([
	"WHITE",
	"ORANGE",
	"MAGENTA",
	"LIGHT_BLUE",
	"YELLOW",
	"LIME",
	"PINK",
	"GRAY",
	"LIGHT_GRAY",
	"CYAN",
	"PURPLE",
	"BLUE",
	"BROWN",
	"GREEN",
	"RED",
	"BLACK",
]);

//}
// #endregion colors


//# region patterns
//{

/**
	@typedef {Object} PatternEntry
	@property {string} name The user friendly name of the pattern
	@property {string} tagId The value used for banner_patterns tag
*/


class PatternEntrySetBuilder {
	
	/**
		@type {Object.<string, PatternEntry>}
	*/
	#entrySet
	
	/**
		@param {Array.<[string,string]>} arguments to make the entries. [0] is key name, [1] is tagId. the keys are formed from the name by replacing spaces for underscores and making all uppercase.
	*/
	constructor(args){
		this.#entrySet = {};
		args.forEach(([name,tagId])=>{
			const key = name.replaceAll(" ", "_").toUpperCase();
			this.add(key,name,tagId);
		});
	}
	
	add(key,name,tagId){
		this.#entrySet[key] = {name, tagId};
		return this; // for chaining
	}
	
	build(){
		return Object.freeze(this.#entrySet);
	}
}


/**
	@type {Object.<string, PatternEntry>}
*/
export const PATTERN = (
	new PatternEntrySetBuilder([
		[ "base",                  "stripe_bottom"],
		[ "base dexter canton",    "square_bottom_left"],
		[ "base indented",         "triangles_bottom"],
		[ "base sinister canton",  "square_bottom_right"],
		[ "bordure",               "border"],
		[ "chevron",               "triangle_bottom"],
		[ "chief",                 "stripe_top"],
		[ "chief dexter canton",   "square_top_left"],
		[ "chief indented",        "triangles_top"],
		[ "chief sinister canton", "square_top_right"],
		[ "fess",                  "stripe_middle"],
		[ "inverted chevron",      "triangle_top"],
		[ "lozenge",               "rhombus"],
		[ "pale dexter",           "stripe_left"],
		[ "pale sinister",         "stripe_right"],
		[ "per fess",              "half_horizontal"],
		[ "per fess inverted",     "half_horizontal_bottom"],
		[ "per pale",              "half_vertical"],
		[ "per pale inverted",     "half_vertical_right"]
	])
	.build()
);

//}
// #endregion patterns
