// 云函数入口文件
const cloud = require('wx-server-sdk')
var crypto = require('crypto');
var CryptoJS = require('crypto-js')

cloud.init({
  traceUser: true,
  env: "ipasswd-7h7iu"
})

const db = cloud.database()

function encoder(argv) {
  var keys = new Array(4);
  for (let i = 0; i < 4; i++) {
    keys[i] = new Array(10);
  }
  keys[0] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "#"]
  keys[1] = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "#"]
  keys[2] = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "#", "#"]
  keys[3] = ["z", "x", "c", "v", "b", "n", "m", "#", "#", "#", "#"]

  var rtn = {
    data: "",
    arrgs: []
  }

  var pos = new Array(randomer(rtn.arrgs,3), randomer(rtn.arrgs,10))
  var vec = new Array(0, 0), nvec = new Array(0, 0)
  var getUpper = false, isUpperPoss = 0.2, allGetUpper = false
  var getSpecial = false, isSpecialPoss = 0.1, allGetSpecial = false
  for (let i = 0; i < argv.length; i++) {
    nvec[0] = randomer(rtn.arrgs,50)
    nvec[1] = randomer(rtn.arrgs,50)
    vec[0] = nvec[0] * 0.08
    vec[1] = nvec[1] * 0.24
    if (possibility(rtn.arrgs, 0.5)) {
      vec[0] *= -1
    }
    if (possibility(rtn.arrgs, 0.5)) {
      vec[1] *= -1
    }
    pos = new Array(pos[0] + vec[0], pos[1] + vec[1])
    if (pos[0] > 3.4 || pos[0] < 0) {
      pos[0] = randomer(rtn.arrgs,3)
    }
    if (pos[1] > 10.4 || pos[1] < 0) {
      pos[1] = randomer(rtn.arrgs,10)
    }
    var tstr = keys[Math.round(pos[0])][Math.round(pos[1])]
    if(tstr == "#"){
      i -= 1;
      continue;
    }
    if (argv.hasUpper == true){
      if (possibility(rtn.arrgs, isUpperPoss)){
        tstr = tstr.toUpperCase()
        getUpper = true
        allGetUpper = true
      }

      if ((i+2) == argv.length && allGetUpper == false) {
        tstr = 'Z';
      }

      if(getUpper == false){
        isUpperPoss *= 1.5
      }
      else{
        getUpper = false
        isUpperPoss *= 0.2
        if(isUpperPoss < 0.1) isUpperPoss = 0.2
      }
    }

    if (argv.hasSpecial == true) {

      if (possibility(rtn.arrgs, isSpecialPoss)) {
        var selectedSpecial = argv.specialChar;
        var srand = randomer(rtn.arrgs, selectedSpecial.length)
        tstr = selectedSpecial[srand]
        getSpecial = true
        allGetSpecial = true
      }

      if ((i+1) == argv.length && allGetSpecial == false) {
        var selectedSpecial = argv.specialChar;
        var srand = randomer(rtn.arrgs, selectedSpecial.length)
        tstr = selectedSpecial[srand]
      }

      if (getSpecial == false) {
        isSpecialPoss *= 1.5
      }
      else {
        getSpecial = false
        isSpecialPoss *= 0.1
        if (isSpecialPoss < 0.05) isSpecialPoss = 0.1
      }
    }
    
    rtn.data += tstr

  }
  return rtn
}


function decoder(argv, rands) {
  var ridx = 0
  var keys = new Array(4);
  for (let i = 0; i < 4; i++) {
    keys[i] = new Array(10);
  }
  keys[0] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "#"]
  keys[1] = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "#"]
  keys[2] = ["a", "s", "d", "f", "g", "h", "j", "k", "l", "#", "#"]
  keys[3] = ["z", "x", "c", "v", "b", "n", "m", "#", "#", "#", "#"]

  var rtn = {
    data: "",
    arrgs: []
  }

  var pos = new Array(derandomer(rands[ridx++], 3), derandomer(rands[ridx++], 10))
  var vec = new Array(0, 0), nvec = new Array(0, 0)
  var getUpper = false, isUpperPoss = 0.2, allGetUpper = false
  var getSpecial = false, isSpecialPoss = 0.1, allGetSpecial = false
  for (let i = 0; i < argv.length; i++) {
    nvec[0] = derandomer(rands[ridx++], 50)
    nvec[1] = derandomer(rands[ridx++], 50)
    vec[0] = nvec[0] * 0.08
    vec[1] = nvec[1] * 0.24
    if (depossibility(rands[ridx++], 0.5)) {
      vec[0] *= -1
    }
    if (depossibility(rands[ridx++], 0.5)) {
      vec[1] *= -1
    }
    pos = new Array(pos[0] + vec[0], pos[1] + vec[1])
    if (pos[0] > 3.4 || pos[0] < 0) {
      pos[0] = derandomer(rands[ridx++], 3)
    }
    if (pos[1] > 10.4 || pos[1] < 0) {
      pos[1] = derandomer(rands[ridx++], 10)
    }
    var tstr = keys[Math.round(pos[0])][Math.round(pos[1])]
    if (tstr == "#") {
      i -= 1;
      continue;
    }
    if (argv.hasUpper == true) {
      if (depossibility(rands[ridx++], isUpperPoss)) {
        tstr = tstr.toUpperCase()
        getUpper = true
        allGetUpper = true
      }

      if ((i+2) == argv.length && allGetUpper == false) {
        tstr = 'Z';
      }

      if (getUpper == false) {
        isUpperPoss *= 1.5
      }
      else {
        getUpper = false
        isUpperPoss *= 0.2
        if (isUpperPoss < 0.1) isUpperPoss = 0.2
      }
    }

    if (argv.hasSpecial == true) {

      if (depossibility(rands[ridx++], isSpecialPoss)) {
        var selectedSpecial = argv.specialChar;
        var srand = derandomer(rands[ridx++], selectedSpecial.length)
        tstr = selectedSpecial[srand]
        getSpecial = true
        allGetSpecial = true
      }

      if ((i+1) == argv.length && allGetSpecial == false) {
        var selectedSpecial = argv.specialChar;
        var srand = derandomer(rands[ridx++], selectedSpecial.length)
        tstr = selectedSpecial[srand]
      }

      if (getSpecial == false) {
        isSpecialPoss *= 1.5
      }
      else {
        getSpecial = false
        isSpecialPoss *= 0.1
        if (isSpecialPoss < 0.05) isSpecialPoss = 0.1
      }
    }

    rtn.data += tstr

  }
  return rtn
}


function possibility(args, possb){
  var tmp = Math.random()
  args.push(tmp)
  if (possb > tmp){
      return true;
  }
  else return false;
}

function depossibility(arg, possb) {
  var tmp = arg
  if (possb > tmp) {
    return true;
  }
  else return false;
}

function randomer(args, range) {
  var tmp = Math.random()
  args.push(tmp)
  return Math.floor(tmp * range);
}

function derandomer(arg, range) {
  var tmp = arg
  return Math.floor(tmp * range);
}

function aes_encrypt(data, openid, iv){
  var blocks = parseInt(data.length / 16)
  if (data.length % 16 != 0) blocks += 1;
  buffdata = new Buffer(16 * blocks)
  console.log("Blocks",blocks)
  buffdata.write(data)
  data = buffdata
  console.log("Buffdata",buffdata)
  
  var algorithm = 'aes-256-ecb'
  var key = crypto.createHash('sha256').update(openid).digest('hex')
  key = key.substr(0, 32)
  key = key.toString('hex')
  console.log("Data", data, "Key", key)
  var clearEncoding = 'ascii'
  var cipherEncoding = 'base64'
  iv = iv || ""
  var cipher = crypto.createCipher(algorithm, key, iv)
  cipher.setAutoPadding(true);
  var cipherChunks = []
  cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));
  return cipherChunks.join('')
}

function aes_decode(ciphertext, openid, iv){
  var algorithm = 'aes-256-ecb'
  var key = crypto.createHash('sha256').update(openid).digest('hex')
  key = key.substr(0, 32)
  key = key.toString('hex')
  console.log("Key", key)
  var clearEncoding = 'ascii'
  var cipherEncoding = 'base64'
  iv = iv || "";
  var decipher = crypto.createDecipheriv(algorithm, key, iv)
  decipher.setAutoPadding(false);
  console.log("crypted:" + ciphertext)
  var cipherChunks = [];
  cipherChunks.push(decipher.update(ciphertext, cipherEncoding, clearEncoding));
  cipherChunks.push(decipher.final(clearEncoding));
  var decrypted = cipherChunks.join('')
  return decrypted;
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("[云函数] 调用 " + event.method) 
  if (event.method == "encoder") {
    var rtn = encoder(event.argv)

    var code = String(wxContext.openid)
    for (var i = 0; i < rtn.arrgs.length; i++) {
      code += String(rtn.arrgs[i])
    }
    var handle_hash = crypto.createHash('sha256').update(code).digest('hex');
    return new Promise((resolve, reject) => {
      db.collection('passwd').add({
        data: {
          openid: wxContext.OPENID,
          args: rtn.arrgs,
          handle_hash: handle_hash,
          argv: event.argv
        }
      }).then(res => {
          if (res.errMsg == "collection.add:ok") {
            resolve({
              event,
              openid: wxContext.OPENID,
              appid: wxContext.APPID,
              passwd: rtn.data,
              handle: handle_hash,
              status: "ok"
            })
          }
          else {
            resolve({
              event,
              openid: wxContext.OPENID,
              appid: wxContext.APPID,
              status: "fail"
            })
          }
      })
    })
  }
  else if (event.method == "saver") {
    var handle = event.argv.handle
    var openid = event.argv.openid
    var tag = event.argv.tag
    return new Promise((resolve, reject) => {
      db.collection("passwd").where({
        handle_hash: handle,
        openid: openid
      }).limit(1).get().then(res => {
        console.log(res)
        if (res.data.length > 0) {
          var tag_hash = crypto.createHash('sha256').update(tag).digest('hex')
          db.collection('passwd_saved').add({
            data: {
              openid: wxContext.OPENID,
              args: res.data[0].args,
              handle_hash: handle,
              tag_hash: tag_hash,
              argv : res.data[0].argv,
              custom: false
            }
          }).then(res => {
              if (res.errMsg == "collection.add:ok") {
                resolve({
                  event,
                  openid: wxContext.OPENID,
                  appid: wxContext.APPID,
                  handle: handle_hash,
                  status: "ok"
                })
              }
              else {
                resolve({
                  event,
                  openid: wxContext.OPENID,
                  appid: wxContext.APPID,
                  status: "fail"
                })
              }
          })
        }
      })
    })
  }
  else if (event.method == "customer") {
    var handle_hash = event.argv.handle
    var openid = event.argv.openid
    var tag = event.argv.tag
    var passwd = event.argv.passwd
    return new Promise((resolve, reject) => {
      db.collection("passwd").where({
        handle_hash: handle_hash,
        openid: openid
      }).limit(1).get().then(res => {
        if (res.data.length > 0) {
          
          var tag_hash = crypto.createHash('sha256').update(tag).digest('hex')

          var key = crypto.createHash('sha256').update(openid).digest('hex')
          key = key.substr(0, 32)
          key = key.toString('hex')

          var encrypt = CryptoJS.AES.encrypt(passwd, CryptoJS.enc.Utf8.parse(key), {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
          });

          db.collection("passwd_saved").add({
            data: {
              openid: wxContext.OPENID,
              ciphertext: encrypt.toString(),
              handle_hash: handle_hash,
              tag_hash: tag_hash,
              custom: true
            }
          }).then(res => {
              if (res.errMsg == "collection.add:ok") {
                resolve({
                  event,
                  openid: wxContext.OPENID,
                  appid: wxContext.APPID,
                  handle: handle_hash,
                  status: "ok"
                })
              }
              else {
                resolve({
                  event,
                  openid: wxContext.OPENID,
                  appid: wxContext.APPID,
                  status: "fail"
                })
              }
          })
        }
      })
    })
  }
  else if (event.method == "decoder") {
    var handle_hash = event.argv.handle
    var openid = event.argv.openid
    return new Promise((resolve, reject) => {
      db.collection("passwd_saved").where({
        handle_hash: handle_hash,
        openid: openid
      }).limit(1).get().then(res => {
        console.log(res)
        if (res.data.length > 0) {
          if(res.data[0].custom){
            var key = crypto.createHash('sha256').update(openid).digest('hex')
            key = key.substr(0, 32)
            key = key.toString('hex')

            var decrypt = CryptoJS.AES.decrypt(res.data[0].ciphertext, CryptoJS.enc.Utf8.parse(key), {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
            });
            resolve({
              event,
              openid: wxContext.OPENID,
              appid: wxContext.APPID,
              passwd: decrypt.toString(CryptoJS.enc.Utf8),
              status : "ok",
              handle : handle_hash
            })
          }
          else{
            var args = res.data[0].args
            var argv = res.data[0].argv
            var rtn = decoder(argv,args)
            resolve({
              openid: wxContext.OPENID,
              appid: wxContext.APPID,
              passwd: rtn.data,
              status: "ok",
              handle: handle_hash
            })
          }
        }
      })
    })
  }
  else if (event.method == "deleter"){
    var handle_hash = event.argv.handle
    var openid = event.argv.openid
    return new Promise((resolve, reject) => {
      if (wxContext.OPENID != openid){
        resolve({
          status: "failed",
          openid : openid
        })
      }
      var handle = handle_hash
      var openid = openid
      db.collection("passwd-saved").where({
        handle: handle,
        openid: wxContext.OPENID
      }).get().then(res=>{
        console.log(res)
        if(res.data.length > 0){
          db.collection("passwd-saved").doc(res.data[0]._id).remove().then(res => {
          })
          resolve({
            status: "ok",
            openid: openid
          })
        }
        else{
          resolve({
            status: "failed",
            openid: openid
          })
        }
      })


    })
  }
}

