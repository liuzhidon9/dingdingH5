<template>
  <div id="app">
    <h1>钉钉视频会议</h1>
    <h3>{{ department }}</h3>
    <ul>
      <li v-for="item in memberList" :key="item.userid">
        <label :for="item.userid">{{ item.name }}</label>
        <input type="checkbox" name="" :value="item.userid" :id="item.userid" />
      </li>
    </ul>
    <div class="row" style="display: flex; justify-content: center"><button class="call">发起视频会议</button></div>
  </div>
</template>

<script>
import axios from "axios";
import * as dd from "dingtalk-jsapi";
import crypto from "crypto";
const AppKey = "dingdy4jvvxkrgzvv6hv";
const AppSecret = "PZLKKKz7eetQ0yjD_LyHLu-rECbdMWtKLKGOiFpGEz02IbN2n5la_2s32B36oUzf";
const CorpId = "dingb8dd67de6dece55d4ac5d6980864d335";
const AgentId = "1055458886";
// let signature = CryptoJS.SHA1(plainTex).toString();
export default {
  data() {
    return {
      department: "神秘企业",
      memberList: [
        { name: "刘伟青", userid: "322013122320863019" },
        { name: "邵建欣", userid: "111008421936381406" },
        { name: "陈道钊", userid: "043365510338154975" },
        { name: "刘志东", userid: "201601160520976957" },
        { name: "赵锦华", userid: "215038461736005661" },
      ],
    };
  },
  methods: {
    call() {
      dd.ready(function () {
        if (dd.env.platform === "pc") {
          dd.device.notification.alert({
            message: "请在手机端打开该页面",
            title: "提示", //可传空
            buttonName: "",
            onSuccess: function () {
              //onSuccess将在点击button之后回调
              /*回调*/
            },
            onFail: function (err) {
              console.log(err);
            },
          });
          return;
        }

        let call = document.querySelector(".call");
        call.addEventListener("click", () => {
          let members = document.querySelectorAll("input[type='checkbox']:checked");
          let userids = [];
          for (let index = 0; index < members.length; index++) {
            userids.push(members[index].value);
          }
          if (userids.length == 0) {
            dd.device.notification.alert({
              message: "请选择参会人员！",
              title: "提示", //可传空
              buttonName: "收到",
              onSuccess: function () {
                //onSuccess将在点击button之后回调
                /*回调*/
              },
              onFail: function (err) {
                console.log(err);
              },
            });
            return;
          }
          console.log("userids", userids);
          dd.biz.conference.videoConfCall({
            title: "视频会议测试",
            calleeCorpId: CorpId,
            calleeStaffIds: userids,
            onSuccess: function (res) {
              console.log("success", res);
            },
            onFail: function (err) {
              console.log("fail", err);
            },
          });
        });
      });
    },
    async getTokenn() {
      let res = await axios.get("/gettoken", {
        params: {
          appkey: AppKey,
          appsecret: AppSecret,
        },
      });
      return res;
    },
    async getTicket(accessToken) {
      let res = axios.get("/get_jsapi_ticket", {
        params: {
          access_token: accessToken,
        },
      });
      return res;
    },
  },
  async mounted() {
    let tokenRes = await this.getTokenn();
    let ticketRes = await this.getTicket(tokenRes.access_token);

    const noncestr = "test";
    const timestamp = new Date().getTime();
    const url = window.location.href.split("#")[0];
    console.log("url", url);
    let plainTex = `jsapi_ticket=${ticketRes.ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
    const hash = crypto.createHash("sha256");
    hash.update(plainTex);
    let signature = hash.digest("hex");
    dd.config({
      agentId: AgentId, // 必填，微应用ID
      corpId: CorpId, //必填，企业ID
      timeStamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名
      type: 0, //选填。0表示微应用的jsapi,1表示服务窗的jsapi；不填默认为0。该参数从dingtalk.js的0.8.3版本开始支持
      jsApiList: ["runtime.info", "biz.contact.choose", "device.notification.confirm", "device.notification.alert", "device.notification.prompt", "biz.ding.post", "biz.util.openLink", "biz.conference.videoConfCall", "device.base.getUUID"], // 必填，需要使用的jsapi列表，注意：不要带dd。
    });
  },
};
</script>

<style>
#app {
  padding: 10px;
}
#app ul {
  list-style: none;
  padding: 0;
}
ul li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}
ul li:nth-child(odd) {
  background-color: #eee;
}
ul li:nth-child(even) {
  background-color: #ddd;
}
ul li label,
ul li input[type="checkbox"] {
  margin: 0;
}
ul li label {
  flex: 1;
}
.call {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
