import html2canvas from "html2canvas"; 
import {jsPDF} from "jspdf";
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

export const calculateAngle = (lineA: any, lineB: any,invert?:boolean, abs?:boolean)=> {
    
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
        if(abs) {
            angle = Math.abs(angle)
        }

		return Math.round(angle * 10) / 10;
}

export const converDivToJPEG = async(element:HTMLDivElement, imageName:string) => {
    const canvas = await html2canvas(element,{
        width: 1700,
        height: 800
    });
    const image = canvas.toDataURL('image/png');
    console.log(image)
    downloadImage(image,imageName)

}

export const convertDivToPDF = async(element:HTMLDivElement, docname:string) =>{
    const canvas = await html2canvas(element,{
        width: 2000,
        height: 800
    });
    const image = canvas.toDataURL('image/png');
    console.log(image)
    downloadPDF(image,docname)
}

 const downloadImage = (image:any,imageName:string) => {
    var fakeLink = window.document.createElement("a");
    fakeLink.style.display = "none;";
    fakeLink.download = imageName + ".jpeg";

    fakeLink.href = image;

    document.body.appendChild(fakeLink);
    fakeLink.click();
    document.body.removeChild(fakeLink);

    fakeLink.remove();
}

const downloadPDF = (image:any, docName:string) => {
    var pdf = new jsPDF('l','px',[1700,800]);
    pdf.addImage(image, 'PNG', 10,10,1700,800);
    pdf.save(docName+'.pdf');
}