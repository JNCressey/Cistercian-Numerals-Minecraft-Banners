import {COLOR, PATTERN} from "./banner-types.js";


/**
	@param {import('./banner-types.js').BannerSpecification} bannerSpecification
	@param {HTMLCanvasElement} bannerPreview
*/
export function drawBannerPreview(bannerSpecification, bannerPreview) {
	const drawer = new BannerDrawer(bannerSpecification, bannerPreview);
	drawer.draw();
}

/**
	mapping of COLOR to valid color input for drawing.
	@type {Object.<COLOR, string>}
*/
const webColor = 
Object.entries(COLOR)
.reduce((o, [k,v]) => (o[v] = v.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase()).replaceAll(" ", ""), o), {});/*{
	[COLOR.WHITE]: "",
	[COLOR.ORANGE]: "",
	[COLOR.MAGENTA]: "",
	[COLOR.LIGHT_BLUE]: "",
	[COLOR.YELLOW]: "",
	[COLOR.LIME]: "",
	[COLOR.PINK]: "",
	[COLOR.GRAY]: "",
	[COLOR.LIGHT_GRAY]: "",
	[COLOR.CYAN]: "",
	[COLOR.PURPLE]: "",
	[COLOR.BLUE]: "",
	[COLOR.BROWN]: "",
	[COLOR.GREEN]: "",
	[COLOR.RED]: "",
	[COLOR.BLACK]: "",
};*/
console.log(webColor);

class BannerDrawer
{
	/**
		@param {import('./banner-types.js').BannerSpecification} bannerSpecification
		@param {HTMLCanvasElement} bannerPreview
	*/
	constructor(bannerSpecification, bannerPreview){
		this.canvas = bannerPreview;
		this.bannerSpecification = bannerSpecification;
		
		// canvas details
		this.cx = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height
	}
	
	
	draw(){
		this.#drawbackground(this.bannerSpecification.baseColor);
		
		this.bannerSpecification.patterns.forEach(this.drawPattern);
	}
	
	
	/**
		@param {COLOR} baseColor
	*/
	#drawbackground(baseColor){
		this.cx.fillStyle = webColor[baseColor];
		this.cx.fillRect(0, 0, this.width, this.height);
	}
	
	
	/**
		@param {Object} params
		@param {COLOR} params.color
		@param {import('./banner-types.js').PatternEntry} params.pattern
	*/
	drawPattern({pattern, color}){
		switch(pattern){
			/*case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			
			case PATTERN.:
				break;
			*/
			
		}
	}
}