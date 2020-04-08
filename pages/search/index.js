import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  data: {
    goods:[],
    isFocus:false,
    inputValue:""
  },
  TimeId:-1,
  // 输入框触发事件
  handleInput(e){
    // 获取输入框的值
    const {value}=e.detail;
    // 检测合法性
    if (!value.trim()) {
      this.setData({
        goods:[],
        isFocus:false
      })
      return;
    }
    // 发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId);
    this.TimeId=setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },
  async qsearch(query){
    const res=await request({url:"/goods/search",data:{query}});
    this.setData({
      goods:res
    })
  },
  // 点击取消按钮
  handleCancel(){ 
    this.setData({
      inputValue:"",
      isFocus:false,
      goods:[]
    })
  }
})