// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"体验问题",
        isActive:true
      },
      {
        id:1,
        value:"商品、商家投诉",
        isActive:false
      }
    ],
    chooseImgs:[],
    textValue:""
  },
  // 外网图片路径数组
  uploadImgs:[],
  handleItemChange(e){
    // 获取被点击的标题索引
    const {index}=e.detail;
    // 修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    // 赋值到data中
    this.setData({
      tabs
    })
  },
  // 点击选择图片
  handleChooseImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          chooseImgs:[...this.data.chooseImgs,...result.tempFilePaths]
        })
      }
    });
  },
  handleRemoveImg(e){
    const {index}=e.currentTarget.dataset;
    let {chooseImgs}=this.data;
    chooseImgs.splice(index,1);
    this.setData({
      chooseImgs
    })
  },
  // 文本域输入事件
  handleTextInput(e){
    this.setData({
      textValue:e.detail.value
    })
  },
  // 提交事件
  handleFormSubmit(){
    const {textValue,chooseImgs}=this.data;
    if (!textValue.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    wx.showLoading({
      title: "正在上传",
      mask: true
    });
    if (chooseImgs.length!=0) {
      chooseImgs.forEach((v,i)=>{
        wx.uploadFile({
          url: 'https://imgchr.com/',
          filePath: v,
          name: "file",
          formData: {},
          success: (result)=>{
            let url=JSON.parse(result.data).url;
            this.uploadImgs.push(url);
            if (i===chooseImgs.length-1) {
              wx.hideLoading();
              this.setData({
                textValue:"",
                chooseImgs:[]
              })
            }
            wx.navigateBack({
              delta: 1
            });
          }
        });
      })
    }else{
      console.log("完成");
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
      
    }
  }
})