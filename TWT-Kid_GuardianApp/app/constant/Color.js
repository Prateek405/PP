
let bgColor= "#00004b";
let textColor= "white";
let linksColor= "#918fba";
let footerBg= "black";
let footerText= "white";
let markerColor= "#00004b";




export const changeMode= (isDark)=>{
    console.log("ddd");
    if(isDark==='dark'){
        bgColor= "black";
    }else{
        bgColor= "white";
    }
}

console.log(bgColor);

export {bgColor, textColor, linksColor, footerBg, footerText, markerColor}