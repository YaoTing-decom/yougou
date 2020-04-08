// 同时发送异步的次数
let ajaxTimes=0;
export const request=(params)=>{
  // 判断url
  let header={...params.header};
  if (params.url.includes("/my/")) {
    header["Authorization"]=wx.getStorageSync("token");
  }
  ajaxTimes++;
  // 显示加载中 效果
  wx.showLoading({
    title: '加载中',
    mask:true
  })
  // 定义公共的url
  const baseURL="https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve,reject)=>{
    wx.request({
      ...params,
      header:header,
      url:baseURL+params.url,
      success:(result)=>{
        resolve(result.data.message);
      },
      fail:(err)=>{
        reject(err);
      },
      complete: ()=>{
        ajaxTimes--;
        if (ajaxTimes===0) {
          // 关闭加载中图片
          wx.hideLoading();
        }
      }
    });
  })
}