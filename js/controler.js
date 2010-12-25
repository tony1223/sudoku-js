/**
 * The controller for main.html
 */

/**
 * init for sudoku box
 */
function SudokuBox(context){

	//add every number helper (1-9) each cell here.
	for(var i=0;i<9;i++){
		for(var j=0;j<9;j++){
			var c = i;
			var r = j;
			var g = Math.floor(i/3)*3 + Math.floor(j/3);
			var one=$('<div class="in c'+c+' r'+r+'" r="'+r+'" c="'+c+'" g="'+g+'"></div>').append('<span></span>').appendTo(context);
			for(var m=1;m<=9;m++){
				var t=3+Math.floor((m-1)/3)*12;
				var l=3+Math.floor((m-1)%3)*12;
				$('<div class="mm" m="'+m+'">'+m+'</div>').appendTo(one).css({top:t,left:l});
			}
		}
	}
}

/**
 * bind cell event after cell is created
 * @return SudukuBox
 */
SudokuBox.prototype.bindCell=function(){
	var sudokubox = this;
	var $in=this.getCells();
	$in.click(function(){
		$tar=$(this);
		sudokubox.startUserInput($(this));
	});
	return this;
}

/**
 * focus all the related cells ,
 * including the horizontal line , the vertical line and the groups.
 * @param r horizontal index  from 0 ~ 8
 * @param c vertical index from 0 ~ 8
 * @param g group , 3*3 cells for a group , it's in order from left to right ,
 *   <pre> 0,1,2,
 *          3,4,5,
 *          6,7,8 </pre>
 * @return SudukuBox
 */
SudokuBox.prototype.focusCells=function($tar){
	var $in=this.getCells();
	$in.removeClass('fo');

	this.getRelativeCell($tar).addClass('fo');
	return this;
}

/**
 * update cells for remove the user entered number,
 * if user eneter "1" , all the cell for the horizontal line ,
 * the vertical line and the groups should not exist "1".
 * @param activeCell , we use the cell's value to update cells.
 * @return
 *
 * @Todo here's a bug if user modify the number twice , it will be incorrect.
 */
SudokuBox.prototype.updateCells=function(activeCell){
	var n=activeCell.find('span').html();
	//remove all the numbers in cell
	activeCell.find('.mm').remove();
	this.getRelativeCell(activeCell).find('.mm[m="'+n+'"]').remove();

}
SudokuBox.prototype.getRelativeCell=function(activeCell){
	var r = activeCell.attr('r'),
		c = activeCell.attr('c'),
		g = activeCell.attr('g');

	return this.getCells().filter('[r="'+r+'"],[c="'+c+'"],[g="'+g+'"]');
}
/**
 * get all the cell contrains
 * @return
 */
SudokuBox.prototype.getCells=function(){
	return $('.in');
}

/**
 * we need to hide numbers when user is tpying his number.
 * This implement is too low-end , that any user should not call this function directly.
 * @param activeCell
 * @return
 */
/* private */ SudokuBox.prototype._maskCell=function(activeCell){
	/**
	 * we use a div to overlap the cells numbers , and we call it "put"
	 */

	var txt = activeCell.css('margin-top');

	//use parseInt(xxx , 10)  instead parseInt(xxx) to prevent Octal number issue.
	var t = activeCell.position().top + parseInt( txt.substr(0,txt.length) , 10);
	var l = activeCell.position().left;
	var $put = $('.put');
	$put.css({left:l,top:t}).show();
}

/**
 *
 * @param $tar
 * @return
 * @Todo a warning for user entered a already exist number.
 */
SudokuBox.prototype.startUserInput=function($tar){
	var r=$tar.attr('r'),
		c=$tar.attr('c'),
	    $in=this.getCells(),
	    $put=$('.put'),
	    sudokubox = this;
	this._maskCell($tar);
	this.focusCells($tar);
	$('<input type="text" r="'+r+'" c+"'+c+'" />').appendTo($put).keyup(function(){
		$this = $(this);
		$in.filter('[r="'+r+'"][c="'+c+'"]').find('span').html($this.val());
		sudokubox.updateCells($tar);
		$in.removeClass('fo');
		$put.hide().find('input').remove();
	}).focusout(function(){
		$in.removeClass('fo');
		$put.hide().find('input').remove();
	}).width(20).height(20).focus();
}

var box=$('.box');

var sudokubox = new SudokuBox(box);
sudokubox.bindCell();



/**
 * determine the group.
 * @return
 */

function check_4(){
	var $in = $(".in");
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
		solve();
	}
}
function check_5(){
	var $in = $(".in");
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
		solve();
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


/**
 * Start to resolve the soduku. (The event handler for the button)
 * @return
 */
function solve(){
	//remove old result
	$('span').removeClass('red');
	var flag = SolveStrategy.one(sudokubox);
	if(SolveStrategy.one(sudokubox)){ //if nothing changes
		//if there not any existing empty cell ,
		//it means game is over now.
		if($('.mm').length == 0){
			$('.info').html('結束');
			return;
		}

		if(SolveStrategy.group(sudokubox)){
			check_4();
		}else{
			solve();
		}

	}else{
		// if it change something , we just run it again after.
		// because if you fill a cell , it will effect other cell's number(mn).
		setTimeout(solve,500);
	}
}
$('#check_ok2').click(solve);