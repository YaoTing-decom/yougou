// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    this.setData({
      address
    });
    // 总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    // 把购物车数据重新设置回data和缓存中
    this.setData({
      cart,
      totalPrice,
      address,
      totalNum,
    });
  },
  // 点击支付
  async handleOrderPay() {
    try {
      // 判断缓存中有没有token
      const token = wx.getStorageSync("token");
      // 判断
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index',
        });
        return;
      }
      // 创建订单
      // 请求头参数
      // const header = { Authorization: token };
      // 准备请求参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = { order_price, consignee_addr, goods }
      // 发送请求创建订单 获取订单编号
      const { order_number } = await request({ url: "/my/orders/create", method: "POST", data: orderParams });
      // 发起预支付接口
      const { pay } = await request({ url: "/my/orders/req_unifiedorder", method: "POST", data: { order_number } });
      // 发起微信支付
      await requestPayment(pay);
      // 查询订单状态
      const res = await request({ url: "/my/orders/chkOrder", method: "POST", data: { order_number } });
      await showToast({title:"支付成功"});
      // 手动删除已经支付的商品
      let newCart=wx.getStorageSync("cart");
      newCart=newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);
      // 支付成功 跳转至订单页面
      wx.navigateTo({
        url: '/pages/order/index'
      });
    } catch (error) {
      await showToast({title:"支付失败"})
      console.log(error);
    }
  }
})