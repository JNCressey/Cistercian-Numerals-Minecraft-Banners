import {COLOR, PATTERN} from "./banner-types.js";


/**
	@param {import('./banner-types.js').BannerSpecification} bannerSpecification
	@param {HTMLCanvasElement} bannerPreview
*/
export function drawBannerPreview(bannerSpecification, bannerPreview) {
	const drawer = new BannerDrawer(bannerSpecification, bannerPreview);
	drawer.draw();
}

/*** todo match minecraft's colors */
/**
	mapping of COLOR to valid color input for drawing.
	@type {Object.<COLOR, string>}
*/
const webColor = {
	[COLOR.WHITE]:      "#ecf2f1",
	[COLOR.ORANGE]:     "#ec791c",
	[COLOR.MAGENTA]:    "#bd4ab3",
	[COLOR.LIGHT_BLUE]: "#37aacf",
	[COLOR.YELLOW]:     "#f1cd3a",
	[COLOR.LIME]:       "#79bd1d",
	[COLOR.PINK]:       "#e884a2",
	[COLOR.GRAY]:       "#444c4e",
	[COLOR.LIGHT_GRAY]: "#969690",
	[COLOR.CYAN]:       "#159393",
	[COLOR.PURPLE]:     "#822faf",
	[COLOR.BLUE]:       "#3940a1",
	[COLOR.BROWN]:      "#7d5030",
	[COLOR.GREEN]:      "#5a7715",
	[COLOR.RED]:        "#a72c24",
	[COLOR.BLACK]:      "#1c1c20",
};

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
		
		this.constructDimensions();
	}
	
	
	draw(){
		this.#drawbackground(this.bannerSpecification.baseColor);
		
		this.bannerSpecification.patterns.forEach(patternApplication => this.drawPattern(patternApplication));
	}
	
	
	/**
		@param {COLOR} color
	*/
	setColor(color){
		const c = webColor[color];
		this.cx.fillStyle = c;
		this.cx.strokeStyle = c;
	}
	
	
	/**
		@param {COLOR} baseColor
	*/
	#drawbackground(baseColor){
		this.setColor(baseColor);
		this.cx.fillRect(0, 0, this.width, this.height);
	}
	
	
	constructDimensions() {
		const {height, width} = this;
		const dimension = {};
		dimension.halfX = width/2;
		dimension.halfY = height/2;
		
		dimension.chief = height*14/40;
		dimension.cantonY = height*14/40;
		dimension.chiefIndented = height*7/40;
		
		dimension.lozengeX = width*3/20;
		dimension.lozengeY = height*8/40;
		
		dimension.bordure = width*4/20;
		dimension.fess = height*6/40;
		
		dimension.pale = width*7/20;
		
		this.dimension = dimension;
	}
	
	/**
		@param {Object} patternApplication
		@param {COLOR} params.color
		@param {import('./banner-types.js').PatternEntry} params.pattern
	*/
	drawPattern({color, pattern}){
		const {cx, height, width, dimension} = this;
		this.setColor(color);
		
		switch(pattern){
			case PATTERN.BASE:
				cx.fillRect(
					0,     height-dimension.chief, 
					width, dimension.chief);
				break;
			
			case PATTERN.BASE_DEXTER_CANTON:
				cx.fillRect(
					0,               height-dimension.cantonY,
					dimension.halfX, dimension.cantonY);
				break;
			
			case PATTERN.BASE_INDENTED:
				{
					const widthStep = width/6;
					cx.beginPath();
					cx.moveTo(0,           height                        );
					cx.lineTo(widthStep*1, height-dimension.chiefIndented);
					cx.lineTo(widthStep*2, height                        );
					cx.lineTo(widthStep*3, height-dimension.chiefIndented);
					cx.lineTo(widthStep*4, height                        );
					cx.lineTo(widthStep*5, height-dimension.chiefIndented);
					cx.lineTo(width,       height                        );
					cx.closePath();
					cx.fill();
				}
				break;
			
			case PATTERN.BASE_SINISTER_CANTON:
				cx.fillRect(
					dimension.halfX, height-dimension.cantonY,
					dimension.halfX, dimension.cantonY);
				break;
			
			case PATTERN.BORDURE:
				cx.beginPath();
				cx.lineWidth = dimension.bordure*2;
				cx.moveTo(0,     0     );
				cx.lineTo(width, 0     );
				cx.lineTo(width, height);
				cx.lineTo(0,     height);
				cx.closePath();
				cx.stroke();
				break;
			
			case PATTERN.CHEVRON:
				cx.beginPath();
				cx.moveTo(0,               height         );
				cx.lineTo(dimension.halfX, dimension.halfY);
				cx.lineTo(width,           height         );
				cx.closePath();
				cx.fill();
				break;
			
			case PATTERN.CHIEF:
				cx.fillRect(0, 0, width, dimension.chief);
				break;
			
			case PATTERN.CHIEF_DEXTER_CANTON:
				cx.fillRect(
					0,               0, 
					dimension.halfX, dimension.cantonY);
				break;
			
			case PATTERN.CHIEF_INDENTED:
				{
					const widthStep = width/6;
					cx.beginPath();
					cx.moveTo(0,           0                        );
					cx.lineTo(widthStep*1, 0+dimension.chiefIndented);
					cx.lineTo(widthStep*2, 0                        );
					cx.lineTo(widthStep*3, 0+dimension.chiefIndented);
					cx.lineTo(widthStep*4, 0                        );
					cx.lineTo(widthStep*5, 0+dimension.chiefIndented);
					cx.lineTo(width,       0                        );
					cx.closePath();
					cx.fill();
				}
				break;
			
			case PATTERN.CHIEF_SINISTER_CANTON:
				cx.fillRect(
					dimension.halfX, 0,
					dimension.halfX, dimension.cantonY);
				break;
			
			case PATTERN.FESS:
				cx.lineWidth = dimension.fess;
				cx.beginPath();
				cx.moveTo(0,     dimension.halfY);
				cx.lineTo(width, dimension.halfY);
				cx.stroke();
				break;
			
			case PATTERN.INVERTED_CHEVRON:
				cx.beginPath();
				cx.moveTo(0,               0              );
				cx.lineTo(dimension.halfX, dimension.halfY);
				cx.lineTo(width,           0              );
				cx.closePath();
				cx.fill();
				break;
			
			case PATTERN.LOZENGE:
				cx.beginPath();
				cx.moveTo(dimension.halfX,          0+dimension.lozengeY     );
				cx.lineTo(width-dimension.lozengeX, dimension.halfY          );
				cx.lineTo(dimension.halfX,          height-dimension.lozengeY);
				cx.lineTo(0+dimension.lozengeX,     dimension.halfY          );
				cx.closePath();
				cx.fill();
				break;
			
			case PATTERN.PALE_DEXTER:
				cx.fillRect(
					0,              0, 
					dimension.pale, height);
				break;
			
			case PATTERN.PALE_SINISTER:
				cx.fillRect(
					width-dimension.pale, 0, 
					dimension.pale,       height);
				break;
			
			case PATTERN.PER_FESS:
				cx.fillRect(
					0,     0, 
					width, dimension.halfY);
				break;
			
			case PATTERN.PER_FESS_INVERTED:
				cx.fillRect(
					0,     dimension.halfY, 
					width, dimension.halfY);
				break;
			
			case PATTERN.PER_PALE:
				cx.fillRect(
					0,               0,
					dimension.halfX, height);
				break;
			
			case PATTERN.PER_PALE_INVERTED:
				cx.fillRect(
					dimension.halfX, 0,
					dimension.halfX, height);
				break;
		}
	}
}