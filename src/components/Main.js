require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';
//获取图片相关数据
let imageDatas=require('../data/imageDatas.json');

//将图片信息转换成图片URL路径信息
function genImageURL(imageDataArr){
	for (var i=0,j=imageDataArr.length;i<j;i++) {
		var singleImageData=imageDataArr[i];
		singleImageData.imageURL=require('../images/'+singleImageData.fileName);
		imageDataArr[i]=singleImageData;
	}
	
	return imageDataArr;
}

imageDatas=genImageURL(imageDatas);

//获取区间内的一个随机值
function getRangeRandom(low,high){
	return Math.ceil(Math.random()*(high-low)+low);
}

//获取0~30度之间的一个任意正负值
function get30DegRandom(){
	return (Math.random()>0.5?"":"-"+Math.ceil(Math.random()*30));
}


	var Constant={
	
		centerPos:{
			left:0,
			right:0,
		},
		hPosRange:{
			//水平方向取值范围
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{
			//垂直方向取值范围
			x:[0,0],
			topY:[0,0]
		}		

	}

//单图组件
class ImgFigureComponent extends React.Component {	
 
 
 handleClick(e){
	if(this.props.arrange.isCenter){
		this.props.inverse();
	}else{
		this.props.center();
	}
 	
 	e.stopPropagation();
 	e.preventDefault();
 }
	
componentDidMount()	{
	
}
  render() {
  	
  	let styleObj={};
  	//如果props属性中指定了这张图片的位置，则使用
  	if(this.props.arrange.pos){
  		styleObj=this.props.arrange.pos;
  	}
  	//如果图片的旋转角度有值且不为0，则添加旋转角度
  	if(this.props.arrange.rotate){
  		(['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value)=>{
  			styleObj[value]='rotate('+this.props.arrange.rotate+'deg)';
  		});
  	}
  	
  	//设置中心图片的层级
  	if(this.props.arrange.isCenter){
  		styleObj.zIndex=11;
  	}
  	//根据isInverse状态添加翻转类名
  	let imgFigureClassName="img-figure";
  	    imgFigureClassName+=this.props.arrange.isInverse?' is-inverse':'';
  	
    return (
     <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
     	<img src={this.props.data.imageURL} alt={this.props.data.title} />
     	<figcaption>
     		<h2 className="img-title">{this.props.data.title}</h2>
     		<div className="img-back" onClick={this.handleClick.bind(this)}>
     		  <p>
     		   {this.props.data.desc}
     		  </p>
     		</div>
     	</figcaption>
     </figure>
    );
  }
}

//控制组件
class ControllerUnit extends React.Component{
	
	handleClick(e){
		//如果点击的是当前正在选中态的按钮，则翻转图片，否则将图片居中
		if(this.props.arrange.isCenter){
			this.props.inverse();
		}else{
			this.props.center()
		}
		e.preventDefault();
		e.stopPropagation();
	}
	
	render(){
		let controllerUnitClassName="controller-unit";

		//如果对应的是居中图片，显示控制按钮居中态
		if(this.props.arrange.isCenter){
			controllerUnitClassName+=" is-center";
			//如果同时对应的是翻转图片，显示控制按钮翻转态
			if(this.props.arrange.isInverse){
				controllerUnitClassName+=" is-inverse";
			}
		}
		return(
			<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}>
			</span>
		)
	}
}



class AppComponent extends React.Component {
	 constructor(props){
	    super(props);
    this.state={
		imgsArrangeArr:[
//		{
//			pos:{
//				left:"0",
//				top:"0"
//			},//图片位置
//			rotate:0,   //旋转角度
//			isInverse:false,  //图片正反面
//          isCenter:false,//图片是否居中
//		}
		]

	};
  }


//翻转图片
//@param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
// @return {Function}这是一个闭包函数，内部return 一个真正待被执行的函数 
 
 inverse(index){

 		var imgsArrangeArr=this.state.imgsArrangeArr;
 		imgsArrangeArr[index].isInverse=!imgsArrangeArr[index].isInverse;
 		this.setState({
 			imgsArrangeArr:imgsArrangeArr
 		});	

 }

//利用rearrange函数，居中对应index的图片
center(index){
	this.reArrange(index);
}

	


/***重新布局所有图片，centerIndex指定居中图片***/
 reArrange(centerIndex){
 	let imgsArrangeArr=this.state.imgsArrangeArr,
// 		Constant=this.Constant,
 		centerPos=Constant.centerPos,
 		hPosRange=Constant.hPosRange,
 		vPosRange=Constant.vPosRange,
 		hPosRangeLeftSecX=hPosRange.leftSecX,
 		hPosRangeRightSecX=hPosRange.rightSecX,
 		hPosRangeY=hPosRange.y,
 		vPosRangeTopY=vPosRange.topY,
 		vPosRangeX=vPosRange.x,
 		imgsArrangeTopArr=[],
 		topImgNum=Math.floor(Math.random()*2),
 		//取一个或者不取
 		topImgSpliceIndex=0,
 		imgsArrangeCenterArr=imgsArrangeArr.splice(centerIndex,1);
 		//首先居中centerIndex的图片，居中图片centerIndex不需要旋转
 		imgsArrangeCenterArr[0]={
 			pos:centerPos,
 			rotate:0,
 			isCenter:true
 		};

 		
 		//取出要布局上侧图片的状态信息
 		topImgSpliceIndex=Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));
 		imgsArrangeTopArr=imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
 		//布局位于上侧的图片
 		imgsArrangeTopArr.forEach((value,index)=>{
 			imgsArrangeTopArr[index]={
 				pos:{
 					top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
 					left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
 				},
 				rotate:get30DegRandom(),
 				isCenter:false
 				
 			}
 		});
 		
 		//布局左右两侧图片
 	
 		for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++){
 				let hPosRangeLORX=[];
 			//前半部分左边，后半部右边
 			if(i<k){
 				hPosRangeLORX=hPosRangeLeftSecX;
 			}else{
 				hPosRangeLORX=hPosRangeRightSecX;
 			}
 			imgsArrangeArr[i]={
 				pos:{
 					top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
 					left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
 				},
 				rotate:get30DegRandom(),
 				isCenter:false
 				
 			}
 		}
 		
// 		debugger;
 		if(imgsArrangeTopArr&&imgsArrangeTopArr[0]){
 			imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
 		}
 		
 		imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
 		
 		this.setState({
 			imgsArrangeArr:imgsArrangeArr
 		});
 		
 		
 		
 }



 componentDidMount(){


 	//组件加载以后，为每张图片计算图片位置
 	//首先获取舞台大小
 	let stageDOM=ReactDOM.findDOMNode(this.refs.stage),
 	    stageW=stageDOM.scrollWidth,
 	    stageH=stageDOM.scrollHeight,
 	    halfStageW=Math.ceil(stageW/2),
 	    halfStageH=Math.ceil(stageH/2);
 	//获取一个imageFigure的大小
 	let imgFigureDOM=ReactDOM.findDOMNode(this.refs.imgFigure0),
 	    imgW=imgFigureDOM.scrollWidth,
 	    imgH=imgFigureDOM.scrollHeight,
 	    halfImgW=Math.ceil(imgW/2),
 	    halfImgH=Math.ceil(imgH/2);
 	    
 	 //计算中心图片的位置点
 	Constant.centerPos={
 	 	left:halfStageW-halfImgW,
 	 	top:halfStageH-halfImgH
 	 }
 	 //计算左侧、右侧区域图片排布位置的取值范围
 	Constant.hPosRange.leftSecX[0]=-halfImgW;
 	Constant.hPosRange.leftSecX[1]=halfStageW-halfImgW*3;
 	 Constant.hPosRange.rightSecX[0]=halfStageW+halfImgW;
 	Constant.hPosRange.rightSecX[1]=stageW-halfImgW;
 	Constant.hPosRange.y[0]=-halfImgH;
 	Constant.hPosRange.y[1]=stageH-halfImgH;
 	 
 	 //计算上侧区域图片排布位置的取值范围
 	Constant.vPosRange.topY[0]=-halfImgH;
 	Constant.vPosRange.topY[1]=halfStageH-halfImgH*3;
 	Constant.vPosRange.x[0]=-halfImgW-imgW;
 	Constant.vPosRange.x[1]=-halfImgW;
 	 
 	 //调用排布位置函数
 	this.reArrange(0);
 }
	
  render() {
  	let controllerUnits=[],
  		imgFigures=[];
  	imageDatas.forEach((value,index)=>{
  		
  	//初始化位置，定位到左上角
  		if(!this.state.imgsArrangeArr[index]){
  			this.state.imgsArrangeArr[index]={
  				pos:{
						left:'0',
						top:'0'
					},
				rotate:0,
				isInverse:false,
				isCenter:false
  			}
  		}
  		
  		imgFigures.push(<ImgFigureComponent data={value} 
  			key={index}
  			arrange={this.state.imgsArrangeArr[index]}  
  			ref={'imgFigure'+index} key={'imgFigure'+index}
  			inverse={()=>this.inverse(index)}
  			center={()=>this.center(index)}
  			/>);
  			
  		controllerUnits.push(<ControllerUnit
  			key={index}
  			arrange={this.state.imgsArrangeArr[index]} 
  			inverse={()=>this.inverse(index)}
  			center={()=>this.center(index)}
  			/>);
  	});
  	
    return (
     <section className="stage" ref="stage">
     	<section className="img-sec">
     		{imgFigures}
     	</section>
     	<nav className="controller-nav">
     		{controllerUnits}
     	</nav>
     </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
