// chrome extension中不能使用console.log
// 所以，需要通过发送请求给后台脚本的方式来打印日志

chrome.devtools.panels.create("My Panel",
    "icons/lulu_icon.png",
    "panel.html",
    function(panel) {
      // code invoked on panel creation
    }
);

const log = (...args) =>
  chrome.runtime.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    method: "log",
    args,
  });

const reload = () => {
  chrome.runtime.sendMessage({
    tabId: chrome.devtools.inspectedWindow.tabId,
    method: "reload",
  });
};


// 注册回调，每一个http请求响应后，都触发该回调
chrome.devtools.network.onRequestFinished.addListener(async (...args) => {
  try {
    const [
      {
        // 请求的类型，查询参数，以及url
        request: { method, queryString, url },

        // 该方法可用于获取响应体
        statusLine,
        getContent
      },
    ] = args;


    if (
      url
        .toString()
        .indexOf("https://assets.msn.com/service/news/feed/pages/dashboard4") !=
      -1
    ) {
      getContent((content) => {
        log("respense:", content);
        if (content.indexOf("TrafficDelays") === -1) {
          reload();
        }
      });
    }
  } catch (err) {
    // log(err.stack || err.toString());
  }
});
