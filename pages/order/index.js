import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders:[],
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      },
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退款/退货",
        isActive:false
      }
    ],
  },
  onShow(options){
    const token=wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    // 获取当前小程序页面栈
    let pages=getCurrentPages();
    let currentPage=pages[pages.length-1];
    // console.log(currentPage.options);
    const {type}=currentPage.options;
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  async getOrders(type){
    const res=await request({url:"/my/orders/all",data:{type}})
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  changeTitleByIndex(index){
    // 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },
  handleItemChange(e){
    // 获取被点击的标题索引
    const {index}=e.detail;
    this.changeTitleByIndex(index);
    // 重新发送请求
    this.getOrders(index+1);
  }
})