function showLog(...args) {
    console.log(...args);
}

function reload() {
    setTimeout(() => window.location.reload(), 3000)
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
      text: "OFF",
    });
  });

// 注册回调，当收到请求的时候触发
chrome.runtime.onMessage.addListener(({ tabId, method, args }) => {
    chrome.action.setBadgeText({
        tabId: tabId,
        text: "ON",
      });

    if (method === "log") {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: showLog,
            args: [args],
        }); 
    }

    if (method === "reload") {
        chrome.scripting.executeScript({
            target: {tabId: tabId},
            func: reload,
            args: [],
        }); 
    }
    
// 在给定tabId的tab页中执行脚本
//   if (method === "log") {
//     chrome.scripting.executeScript(tabId, {
//       code: `console.log(...${JSON.stringify(args)});`,
//     });
//   }
//   if (method === "reload") {
//     chrome.scripting.executeScript(tabId, {
//         code: `setTimeout(() => window.location.reload(), 2000)`,
//       });
//   }
});
