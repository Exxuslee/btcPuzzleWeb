const secp256k1 = require("./secp256k1.js");
const crypto = require('crypto');
const mail = require("./mail");

const target_hash160 = '2f396b29b27324300d0c59b17c3abc1835bd3dbb';
let hash160 = '';
let msg = {};

function time(){
    let x = new Date(Date.now());
    return x.toString();
}
function newTask() {
    let abc = "fecdba9876543210".split("");
    let token = "000000000000000000000000000000000000000000000000";
    token += abc[Math.floor(Math.random() * 8)];
    for (let i = 49; i < 58; i++) token += abc[Math.floor(Math.random() * abc.length)];
    token += '000000';
    return token; //Will return a 32 bit "hash"

}


do {
    let i,j;
    msg.privk = newTask();
    console.log("New task: "+time()+" "+ msg.privk);

    let pubk = secp256k1.getPublicKey(msg.privk, false);
    let pointX = '';
    let pointY = '';
    let pubk_comrress ='';

    if (parseInt(pubk.substr(128),16) % 2) pubk_comrress = '03'+ pubk.substr(2, 64);
    else pubk_comrress = '02'+ pubk.substr(2, 64);

    loop1:
        for (i=0; i < 16777216; i++){
 //       for (i=0; i < 16777; i++){
//    console.log('pubk\t\t\t\t'+pubk);
            let sha = crypto.createHash('sha256').update(Buffer.from(pubk_comrress, 'hex')).digest('hex');
            hash160 = crypto.createHash('ripemd160').update(Buffer.from(sha, 'hex')).digest('hex');
//    console.log("Worker %s", hash160);
            if (hash160 === target_hash160) {
                msg.fori = i;
                console.log("Worker found! %s", msg.privk);
                $('#log').text(msg.privk);
                mail.sendMail(msg);
                break loop1;
            }
            pointX = '0x'+pubk.substr(2, 64);
            pointY = '0x'+pubk.substr(66);
            let point = new secp256k1.Point(BigInt(pointX),BigInt(pointY));
            point = point.add(secp256k1.Point.BASE);
            let newX ='';
            let newY ='';
            for (j=point.x.toString(16).length; j<64;j++) newX += '0';
            for (j=point.y.toString(16).length; j<64;j++) newY += '0';
            newX += point.x.toString(16);
            newY += point.y.toString(16);
            pubk = '04'+ newX + newY;
            if (parseInt(pubk.substr(128),16) % 2) pubk_comrress = '03'+ pubk.substr(2, 64);
            else pubk_comrress = '02'+ pubk.substr(2, 64);
        }
}
while (hash160 !== target_hash160);
console.log('!!!'+msg.privk);



