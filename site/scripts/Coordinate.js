export {Coordinate}
class Coordinate{

    constructor(x,y) {
        this.x=x;
        this.y=y;
        this.decode=["h","g","f","e","d","c","b","a"];
    }

    convertToCHessCords(){
        let chescord="";
        chescord+=`${this.decode[this.x]}${this.y+1}`;
        return chescord
    }
}