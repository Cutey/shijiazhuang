/**
 * element  画布容器
 * colors  颜色数组
 * */
class CreateLegend {
    constructor(element){
        this.init(element);
    }
    init(element){
        if(!element){
            return;
        }
        let el = document.getElementById(element);
        let canvasEle = document.createElement("canvas");
        canvasEle.width = el.offsetWidth;
        canvasEle.height = el.offsetHeight;
        canvasEle.style.position = 'absolute';
        el.append(canvasEle);
        this.contextCanvas = canvasEle.getContext('2d');
        this.legendCanvas = canvasEle;

    }
    createLegendColor(colors){
        this.gradient = this.contextCanvas.createLinearGradient(0, 0, this.legendCanvas.width, 0);
        // 线性渐变
        if(colors && colors.length > 0){
            let t = 1 / colors.length;
            let l = 0;
            for(let i=0;i<colors.length;i++){
                this.gradient.addColorStop(l, colors[i]);
                l = l + t;
            }
        }
        this.contextCanvas.fillStyle = this.gradient;
        this.contextCanvas.fillRect(0, 0, this.legendCanvas.width, this.legendCanvas.height);
    }
}
export default CreateLegend
