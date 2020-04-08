// pages/cart/index.js
import { getSetting, chooseAddress, openSetting,showModal,showToast } from "../../utils/asyncWx.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    address:{},
    cart:[],
    allChecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车数据
    const cart=wx.getStorageSync("cart")||[];
    this.setData({
      address
    });
    this.setCart(cart);
  },
  // 收货地址点击事件
  async handleChooseAddress() {
    try {
      // 获取收货地址
      // 1.获取权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2.判断权限状态
      if (scopeAddress === false) {
        // 诱导用户打开授权页面
        await openSetting();
      }
      // 调用获取收货地址的api
      let address = await chooseAddress();
      address.all=address.provinceName+address.cityName+address.countyName+address.detailInfo;
      // 存入到缓存中
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }
  },
  // 商品的选中
  handleItemChange(e){
    // 获取被修改的商品id
    const goods_id=e.currentTarget.dataset.id;
    // 获取购物车数组
    let {cart}=this.data;
    // 找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id);
    // 选中状态取反
    cart[index].checked=!cart[index].checked;
   this.setCart(cart);
  },
  // 设置购物车状态
  setCart(cart){
    wx.setStorageSync("cart", cart);
    let allChecked=true;
    // 总价格 总数量
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice+=v.num*v.goods_price;
        totalNum+=v.num;
      }else{
        allChecked=false;
      }
    });
    // 判断数组数组是否为空
    allChecked=cart.length!=0?allChecked:false;
    // 把购物车数据重新设置回data和缓存中
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    });
  },
  // 商品的全选
  handleItemAllCheck(){
    // 获取data中得数据
    let {cart,allChecked}=this.data;
    // 修改值
    allChecked=!allChecked;
    // 修改cart中的商品选中状态
    cart.forEach(v=>v.checked=allChecked);
    // 把修改后的值 返回data和缓存中
    this.setCart(cart);
  },
  // 商品数量的编辑
  async handleItemNumEdit(e){
    // 获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    // 获取购物车数组
    let {cart}=this.data;
    // 找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id);
    // 判断是否要执行删除
    if (cart[index].num===1&&operation===-1) {
      // 弹窗提示
      const res=await showModal({content:"您是否要删除?"});
      if (res.confirm) {
        cart.splice(index,1);
        this.setCart(cart);
      }
    }else{
      // 进行修改数量
      cart[index].num+=operation;
      // 返回data和缓存中
      this.setCart(cart);
    }
  },
  // 点击结算
  async handlePay(){
    // 判断收货地址
    const {address,totalNum}=this.data;
    if (!address.userName) {
      await showToast({title:"您还没有选择收货地址"});
      return;
    }
    // 判断有没有选购商品
    if (totalNum===0) {
      await showToast({title:"您还没有选购商品"});
      return;
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})