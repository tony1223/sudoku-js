/**
 * The controller for main.html
 */
var box=$('.box');
for(var i=0;i<9;i++){
	for(var j=0;j<9;j++){
		var c = i;
		var r = j;
		var g = Math.floor(i/3)*3 + Math.floor(j/3);
		var one=$('<div class="in c'+c+' r'+r+'" r="'+r+'" c="'+c+'" g="'+g+'"></div>').append('<span></span>').appendTo(box);
		for(var m=1;m<=9;m++){
			var t=3+Math.floor((m-1)/3)*12;
			var l=3+Math.floor((m-1)%3)*12;
			$('<div class="mm" m="'+m+'">'+m+'</div>').appendTo(one).css({top:t,left:l});
		}
	}
}
var $in=$('.in');
var $put=$('.put');
$in.click(function(){
	$tar=$(this);
	var r=$tar.attr('r');
	var c=$tar.attr('c');
	var g=$tar.attr('g');
	var txt=$tar.css('margin-top');
	var t=$tar.position().top+parseInt(txt.substr(0,txt.length));
	var l=$tar.position().left;
	$put.css({left:l,top:t}).show();
	fo_in(r,c,g);
	$('<input type="text" r="'+r+'" c+"'+c+'" />').appendTo($put).keyup(function(){
		$this = $(this);
		$in.filter('[r="'+r+'"][c="'+c+'"]').find('span').html($this.val());
		check_1($tar);
		clear_input();
	}).focusout(clear_input).width(20).height(20).focus();
});
function fo_in(r,c,g){
	$in.removeClass('fo');
	$in.filter('[r="'+r+'"],[c="'+c+'"],[g="'+g+'"]').addClass('fo');
}
function clear_input(){
	$in.removeClass('fo');
	$put.hide().find('input').remove();
}
function check_1($this){
	var r=$this.attr('r');
	var c=$this.attr('c');
	var g=$this.attr('g');
	var n=$this.find('span').html();
	$this.find('.mm').remove();
	var gg=$in.filter('[r="'+r+'"],[c="'+c+'"],[g="'+g+'"]').find('.mm[m="'+n+'"]').remove();
}
function check_2(){
	var flag = true;
	$('span').removeClass('red');
	$.each(['r','c','g'],function(k,v){
		for(var i=0;i<9;i++){
			var mm=$in.filter('['+v+'="'+i+'"]').find('.mm');
			for(var j=1;j<=9;j++){
				var tmp=mm.filter('[m="'+j+'"]');
				if(tmp.length==1){
					find_one(tmp);
					flag = false;
				}
			}
		}
	});
	$in.has('.mm').each(function(){
		var mm=$(this).find('.mm');
		if(mm.length==1){
			find_one(mm);
			flag = false;
		}
	});
	if(flag){
		if($('.mm').length == 0){
			$('.info').html('結束');
			return;
		}
		check_3();
	}else{
		setTimeout(check_2,500);
	}
}
function check_3(){
	var flag = true;
	for(var g=0;g<9;g++){
		var mm = $in.filter('[g="'+g+'"]').find('.mm');
		if(mm.length == 0)continue;
		for(var m=1;m<=9;m++){
			var tmp = mm.filter('[m="'+m+'"]');
			var tmp_length = tmp.length;
			if(tmp_length == 0)continue
			var p = tmp.parent();
			var r = p.eq(0).attr('r');
			var c = p.eq(0).attr('c');
			var t_r = p.filter('[r="'+r+'"]');
			var t_c = p.filter('[c="'+c+'"]');
			if(t_r.length == p.length){
				var target = $in.filter('[r="'+r+'"]').not(p).find('.mm[m="'+m+'"]');
				if(target.length > 0){
					flag = false;
					target.remove();
				}
			}
			if(t_c.length == p.length){
				var target = $in.filter('[c="'+c+'"]').not(p).find('.mm[m="'+m+'"]');
				if(target.length > 0){
					flag = false;
					target.remove();
				}
			}
		}
	}
	if(flag){
		check_4();
	}else{
		check_2();
	}
}
function check_4(){
	var flag = true;
	$.each(['r','c','g'],function(k,v){
		for(var i=0;i<9;i++){
			var tmp = $in.filter('['+v+'="'+i+'"]').has('.mm');
			if(!check_4_1(tmp)){
				flag = false;
			}
			if(!check_4_2(tmp)){
				flag = false;
			}
		}
	});
	if(flag){
		check_5();
	}else{
		check_2();
	}
}
function check_5(){
	var flag = true;
	var type=['r','c'];
	$.each(['r','c','g'],function(k,v){
		for(var a=0;a<8;a++){
			for(var m=1;m<=9;m++){
				var mm = $in.filter('['+v+'="'+a+'"]').find('.mm[m="'+m+'"]');
				if(mm.length != 2)continue;
				for(var b=a+1;b<9;b++){
					var nn = $in.filter('['+v+'="'+b+'"]').find('.mm[m="'+m+'"]');
					if(nn.length != 2)continue;
					var g=(v=='r')?'c':'r';
					var c = mm.eq(0).parent().attr(g);
					var d = mm.eq(1).parent().attr(g);
					if(nn.eq(0).parent().attr(g) ==c && nn.eq(1).parent().attr(g) == d){
						var target = $in.filter('['+g+'="'+c+'"],['+g+'="'+d+'"]').find('.mm[m="'+m+'"]').not(mm).not(nn);
						if(target.length > 0){
							flag=false;
							target.remove();
						}
					}
				}
			}
		}
	});
	if(flag){
		$('.info').html('結束');
	}else{
		check_2();
	}
}
function check_4_1(tmp){
	var flag = true;
	for(var m=1;m<9;m++){
		var mm = tmp.find('.mm[m="'+m+'"]');
		if(mm.length != 2)continue
		for(var n=m+1;n<=9;n++){
			var nn = tmp.find('.mm[m="'+n+'"]');
			if(nn.length != 2)continue
			if(mm.eq(0).parent().get(0) == nn.eq(0).parent().get(0) && mm.eq(1).parent().get(0) == nn.eq(1).parent().get(0)){
				var target = mm.parent().find('.mm').not(nn).not(mm);
				if(target.length > 0){
					target.remove();
					flag=false;
				}
			}
		}
	}
	return flag;
}
function check_4_2(tmp){
	var flag = true;
	var tmp_length = tmp.length;
	for(var m=0;m<tmp_length-1;m++){
		var mm = tmp.eq(m).find('.mm');
		if(mm.length != 2)continue;
		for(n=m+1;n<tmp_length;n++){
			var nn = tmp.eq(n).find('.mm');
			if(nn.length != 2)continue;
			var a = mm.eq(0).attr('m');
			var b = mm.eq(1).attr('m');
			if(nn.eq(0).attr('m') == a && nn.eq(1).attr('m') == b){
				var target = tmp.find('.mm').filter('[m="'+a+'"],[m="'+b+'"]').not(mm).not(nn);
				if(target.length > 0){
					target.remove();
					flag=false;
				}
			}
		}
	}
	return flag;
}
function find_one($this){
	$this.siblings('span').html($this.attr('m')).addClass('red');
	$this.siblings('.mm').remove();
	var p=$this.parent('.in');
	check_1(p);
	$this.remove();
}
$('#check_ok2').click(check_2);