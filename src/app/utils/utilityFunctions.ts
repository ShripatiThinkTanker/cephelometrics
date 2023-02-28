
var resultDataUrl:any;
let isLoaded = false;
export const convertImageToBase64URL = (items: FileList): boolean =>{
    for(let i = 0; i < items.length; i++){
        const item = items.item(i);
        if(item){
            const reader = new FileReader();
            reader.readAsDataURL(item);
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const result = event.target?.result;
                if (result && typeof result == "string") {
                        localStorage.setItem("imageData", result); 
                        var memoryImg = document.createElement('img');
                        memoryImg.src = result;
                        var width = memoryImg.width;
                        var height = memoryImg.height;
                        localStorage.setItem("width", ""+width); 
                        localStorage.setItem("height", ""+height);
                    

                    isLoaded = true;
                }
                
            };
        }
    }
    return isLoaded;
}

export const calculateAngle = (lineA: any, lineB: any,invert?:boolean)=> {
    
		if (!(lineA.angle && lineB.angle)) {
			return;
		}
		let angle = Math.round((lineA.angle - lineB.angle) * 10) / 10;
		if (angle > 180) {
			angle = angle - 180;
		}

        if (invert) {
			angle = 180 - angle;
		}

		return Math.round(angle * 10) / 10;
}