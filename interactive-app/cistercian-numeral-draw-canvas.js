/**
	@param {number} num
	@param {HTMLCanvasElement} cistercianNumeralOutputElement
*/
export function drawCistercianNumeral(num, cistercianNumeralOutputElement)
{
	const drawer = new cisternNumeralCanvasDrawer(num,10,cistercianNumeralOutputElement);
	drawer.draw();
}

class cisternNumeralCanvasDrawer
{
	/**
	@param {number} num
	@param {number} linewidth
	@param {HTMLCanvasElement} cistercianNumeralOutputElement
*/
	constructor(num,lineWidth,cistercianNumeralOutputElement){
		this.num = num;
		this.lw = lineWidth;
		this.canvas = cistercianNumeralOutputElement;
		
		// canvas details
		this.cx = this.canvas.getContext("2d");
		this.width = this.canvas.width;
		this.height = this.canvas.height
		
		// grid of points
		this.B = [this.width/2, 0           + this.lw];
		this.K = [this.width/2, this.height - this.lw];
		this.digitSize = Math.min(this.width/2, this.height/3) - this.lw/2;
		
		// line style
		this.cx.lineWidth = this.lw;
		this.cx.lineCap = "round";
	}
	
	
	/** 
		make numeral by drawing relevant lines between these points.
		
		A-B-C
		| | |
		D-E-F
		  |
		G-H-I
		| | |
		J-K-L
	*/
	draw(){
		this.#clearCanvas()
			.#drawStem()
			.#drawDigit(this.#getFaceValueAt(0), this.B, +1, +1)
			.#drawDigit(this.#getFaceValueAt(1), this.B, -1, +1)
			.#drawDigit(this.#getFaceValueAt(2), this.K, +1, -1)
			.#drawDigit(this.#getFaceValueAt(3), this.K, -1, -1);
	}
	
	
	// #region draw helpers
	//{
		
	/** 
		Get the face value of a single digit from a number (base-10).
		@param {number} exponent The exponent of base-10 for the place value.
		@return {number} The face value of the digit 0-9.
	*/
	#getFaceValueAt(exponent){
		return (Math.floor(this.num / 10 ** exponent) % 10)
	};

	
	#clearCanvas(){
		this.cx.clearRect(0, 0, this.width, this.height);
		return this; // for chaining
	}
	
	
	#drawStem(){
		const cx = this.cx;
		cx.beginPath();
		cx.moveTo(...this.B);
		cx.lineTo(...this.K);
		cx.stroke();
		return this; // for chaining
	}
	
	
	#drawDigit(faceValue, stemEnd, basisX_awayFromStem, basisY_inwardsAlongStem){
		const cx = this.cx;
		const digitSize = this.digitSize;
		
		// label points based on basis directions, analogous to units place having the labeling PQRS = BCEF
		const P = stemEnd;
		const Q = [
			stemEnd[0] + basisX_awayFromStem*digitSize,
			stemEnd[1]];
		const R = [
			stemEnd[0],
			stemEnd[1] + basisY_inwardsAlongStem*digitSize];
		const S = [
			stemEnd[0] + basisX_awayFromStem*digitSize,
			stemEnd[1] + basisY_inwardsAlongStem*digitSize];
		
		// draw the digit
		switch(faceValue){
			case 0:
				//do nothing for 0
				break;
			
			case 1:
				cx.beginPath();
				cx.moveTo(...P);
				cx.lineTo(...Q);
				cx.stroke();
				break;
				
			case 2:
				cx.beginPath();
				cx.moveTo(...R);
				cx.lineTo(...S);
				cx.stroke();
				break;
				
			case 3:
				cx.beginPath();
				cx.moveTo(...P);
				cx.lineTo(...S);
				cx.stroke();
				break;
				
			case 4:
				cx.beginPath();
				cx.moveTo(...R);
				cx.lineTo(...Q);
				cx.stroke();
				break;
				
			case 5:
				cx.beginPath();
				cx.moveTo(...P);
				cx.lineTo(...Q);
				cx.lineTo(...R);
				cx.stroke();
				break;
				
			case 6:
				cx.beginPath();
				cx.moveTo(...Q);
				cx.lineTo(...S);
				cx.stroke();
				break;
				
			case 7:
				cx.beginPath();
				cx.moveTo(...P);
				cx.lineTo(...Q);
				cx.lineTo(...S);
				cx.stroke();
				break;
				
			case 8:
				cx.beginPath();
				cx.moveTo(...R);
				cx.lineTo(...S);
				cx.lineTo(...Q);
				cx.stroke();
				break;
				
			case 9:
				cx.beginPath();
				cx.moveTo(...P);
				cx.lineTo(...Q);
				cx.lineTo(...S);
				cx.lineTo(...R);
				cx.stroke();
				break;
		}
		
		return this; // for chaining
	}
	
	//}
	// #endregion draw helpers
	
}