import { minify } from "./main.js";
import { parse } from "./lib/parse.js";
const code = `
    const g = 1;
    console.log(g);
`;
const code1 = `
const g=100082918280;
console.log(g);
`;

console.log(minify(code, {
    compress: {
        top_retain: ["g"]
    }
}));
// console.log(minify(code1, {
//     compress: {
//         top_retain: ["g"]
//     }
// }));

var code3 = `
const a = 1;
console.log(a)
const aa = 1;
console.log(aa)
const aaa = 1;
console.log(aaa)
const aaaa = 1;
console.log(aaaa)
const aaaaa = 1;
console.log(aaaaa)
const aaaaaa = 1;
console.log(aaaaaa)
const aaaaaaa = 1;
console.log(aaaaaaa)
const aaaaaaaa = 1;
console.log(aaaaaaaa)
const aaaaaaaaa = 1;
console.log(aaaaaaaaa)
const aaaaaaaaaa = 1;
console.log(aaaaaaaaaa)
const aaaaaaaaaaa = 1;
console.log(aaaaaaaaaaa)
const aaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaa)
const aaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaa)
const aaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaaaaaaaaaa)
const aaaaaaaaaaaaaaaaaaaaaaaaaaa = 1;
console.log(aaaaaaaaaaaaaaaaaaaaaaaaaaa)
`;

// console.log(minify(code3, {
//     compress: {
//         top_retain: "a,aa,aaa,aaaa,aaaaa,aaaaaa,aaaaaaa,aaaaaaaa,aaaaaaaaa,aaaaaaaaaa,aaaaaaaaaaa,aaaaaaaaaaaa,aaaaaaaaaaaaa,aaaaaaaaaaaaaa,aaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaaa,aaaaaaaaaaaaaaaaaaaaaaaaaaa"
//     }
// }));
