// 引入用来发送请求的方法
import { request } from "../../request/index.js";

import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    // 右侧内容滚动条顶部的距离
    scrollTop:0
  },
  // 接口返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    // 判断本地存储中有没有旧的数据
    // 没有旧数据 直接发送新请求
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    }else{
      // 有旧数据 定义一个过期时间 
      if (Date.now()-Cates.time>1000*10) {
        // 重新发送请求
        this.getCates();
      }else{
        // 使用旧数据
        this.Cates=Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // }).then(res => {
    //   this.Cates = res.data.message;
    //   console.log(this.Cates);
    //   // 把接口数据存入到本地存储中
    //   wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
    //   // 构造左侧大菜单数据
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   // 构造右侧商品数据
    //   let rightContent = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })

    // 使用es7的async await来发送请求
    const res=await request({url:"/categories"});
    // this.Cates = res.data.message;
    this.Cates = res;
    console.log(this.Cates);
    // 把接口数据存入到本地存储中
    wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
    // 构造左侧大菜单数据
    let leftMenuList = this.Cates.map(v => v.cat_name);
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单的点击事件
  handleItemTap(e) {
    // 获取被点击的标题身上的索引
    const { index } = e.currentTarget.dataset;
    // 根据不同的索引 来渲染右侧商品的内容
    let rightContent = this.Cates[index].children;
    // 给data中的currentIndex赋值
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view标签的顶部距离
      scrollTop:0
    })
  }
})