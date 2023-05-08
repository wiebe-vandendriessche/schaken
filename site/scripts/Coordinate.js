export {Coordinate}
class Coordinate{
    static decode=["a","b","c","d","e","f","g","h"];

    constructor(x,y) {
        this.x=x;
        this.y=y;
    }

    convertToCHessCords(){
        let chescord="";
        chescord+=`${Coordinate.decode[this.x]}${Math.abs(this.y-8)}`;
        // de min acht is nodig omdat onze nul bovenaan het bord ligt
        // terwijl in het echt dit onderaan is
        return chescord
    }
    static changeToCord(cord){
        let x= +this.decode.indexOf(`${cord[0]}`);
        let y= Math.abs(+cord[1]-8);
        return(new Coordinate(x,y))
    }
}