import * as dd from "dingtalk-jsapi"
const axios = require("axios")
const CorpId = "dingb8dd67de6dece55d4ac5d6980864d335"
const AgentId = "1055458886"
const AppKey = "dingdy4jvvxkrgzvv6hv"
const AppSecret = "PZLKKKz7eetQ0yjD_LyHLu-rECbdMWtKLKGOiFpGEz02IbN2n5la_2s32B36oUzf"
const token = "67e5d514d629313da3772bd0a47760ae"
const ticket = "13nFiIudVbqGprguoOb4T4ADrirfUEYXr69unKvUgNicqU5jG9Oj1JlPwpeamyhaV8j9ss1Jt4jQfxs0RzKyjZ"
const noncestr = "test"
const timestamp = new Date().getTime()
const url = decodeURI(window.location.href)
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
// 可任意多次调用update():
hash.update(`jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`);
let signature = hash.digest("hex")
dd.config({
    agentId: AgentId, // 必填，微应用ID
    corpId: CorpId,//必填，企业ID
    timeStamp: timestamp, // 必填，生成签名的时间戳
    nonceStr: noncestr, // 必填，生成签名的随机串
    signature: signature, // 必填，签名
    type: 0,   //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
    jsApiList: [
        'runtime.info',
        'biz.contact.choose',
        'device.notification.confirm',
        'device.notification.alert',
        'device.notification.prompt',
        'biz.ding.post',
        'biz.util.openLink',
        'biz.conference.videoConfCall'
    ] // 必填，需要使用的jsapi列表，注意：不要带dd。
});

let code
dd.ready(function () {
    dd.runtime.permission.requestAuthCode({
        corpId: CorpId, // 企业id
        onSuccess: function (info) {
            code = info.code // 通过该免登授权码可以获取用户身份
            console.log("info", info);

        }
    });
    dd.biz.conference.videoConfCall({
        title: "a meaningful title",
        calleeCorpId: CorpId,
        calleeStaffIds: ["322013122320863019"],
        onSuccess: function (res) { console.log("success", res); },
        onFail: function (err) { "fail", err }
    })
});
