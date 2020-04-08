// 引入用来发送请求的方法
import { request } from "../../request/index.js";

import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 商品是否被收藏
    isCollect:false
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages= getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;
    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id){
    const goodsObj=await request({url:"/goods/detail",data:{goods_id}});
    this.GoodsInfo=goodsObj;
    // 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collect")||[];
    // 判断当前商品是否被收藏
    let isCollect=collect.some(v=>v.goods_id===this.GoodsInfo.goods_id);
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },
  // 点击轮播图放大预览
  handlePrevewImage(e){
    // 构造要预览的图片数组
    const urls= this.GoodsInfo.pics.map(v=>v.pics_mid);
    // 接收传递过来的图片url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  // 点击加入购物车
  handleCartAdd(){
    // 获取缓存中的购物车数组
    let cart=wx.getStorageSync("cart")||[];
    // 判断商品对象是否存在于购物车数组中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if (index===-1) {
      // 不存在 第一次添加
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo);
    }else{
      // 已经存在购物车数据 执行 num++
      cart[index].num++;
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });
  },
  // 点击收藏商品
  handleCollect(){
    let isCollect=false;
    // 获取缓存中的商品收藏数组
    let collect =wx.getStorageSync("collect")||[];
    // 判断该商品是否被收藏过
    let index=collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if (index!==-1) {
      // 已收藏 删除该商品
      collect.splice(index,1);
      isCollect=false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      // 没收藏过
      collect.push(this.GoodsInfo);
      isCollect=true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    wx.setStorageSync("collect", collect);
    // 修改data中的属性
    this.setData({
      isCollect
    })
  }
})