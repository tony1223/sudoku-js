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
			if(SolveStrategy.check_4(sudokubox)){
				check_5();
			}else{
				solve();
			}
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