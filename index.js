import * as dd from "dingtalk-jsapi"
import CryptoJS from 'crypto-js';
import axios from "axios"
const AppKey = "dingdy4jvvxkrgzvv6hv"
const AppSecret = "PZLKKKz7eetQ0yjD_LyHLu-rECbdMWtKLKGOiFpGEz02IbN2n5la_2s32B36oUzf"
const CorpId = "dingb8dd67de6dece55d4ac5d6980864d335"
const AgentId = "1055458886"


axios.get("/api/gettoken", {
    params: {
        appkey: AppKey,
        appsecret: AppSecret,
    },
}).then(tokenRes => {
    console.log(tokenRes);
    return axios.get("/api/get_jsapi_ticket", {
        params: {
            access_token: tokenRes.data.access_token,
        },
    });
}).then(ticketRes => {
    console.log(ticketRes);
    const ticket = ticketRes.data.ticket
    const noncestr = "test"
    const timestamp = new Date().getTime()
    const url = window.location.href.split("#")[0]
    console.log('url', url);
    let plainTex = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`
    const crypto = require('crypto');
    const hash = crypto.createHash('sha256');
    hash.update(plainTex);
    let signature = hash.digest("hex")
    // let signature = CryptoJS.SHA1(plainTex).toString();
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
            'biz.conference.videoConfCall',
            'device.base.getUUID'
        ] // 必填，需要使用的jsapi列表，注意：不要带dd。
    });


    dd.ready(function () {
        if (dd.env.platform === "pc") {
            dd.device.notification.alert({
                message: "请在手机端打开该页面",
                title: "提示",//可传空
                buttonName: "",
                onSuccess: function () {
                    //onSuccess将在点击button之后回调
                    /*回调*/
                },
                onFail: function (err) { }
            });
            return
        }

        let call = document.querySelector(".call")
        call.addEventListener("click", () => {
            let members = document.querySelectorAll("input[type='checkbox']:checked")
            let userids = []
            for (let index = 0; index < members.length; index++) {

                userids.push(members[index].value)

            }
            if (userids.length == 0) {
                dd.device.notification.alert({
                    message: "请选择参会人员！",
                    title: "提示",//可传空
                    buttonName: "收到",
                    onSuccess: function () {
                        //onSuccess将在点击button之后回调
                        /*回调*/
                    },
                    onFail: function (err) { }
                });
                return
            }
            console.log("userids", userids);
            dd.biz.conference.videoConfCall({
                title: "视频会议测试",
                calleeCorpId: CorpId,
                calleeStaffIds: userids,
                onSuccess: function (res) { console.log("success", res); },
                onFail: function (err) { console.log("fail", err); }
            })

        })
    });
})








