/**
 * We create a strategy class for how to solve sudoku.
 * each return a boolean for find solution or not.
 */
var SolveStrategy = {

	one:function(sudoku){ //original check_1
		var flag = true,
			$in=sudoku.getCells();

		//Here to find which line/group is already feed eight number,
		//and it will auto fill the last number for it .
		// Here's a bit too tricky for me. :P
		$.each(['r','c','g'],function(k,v){
			for(var i=0;i<9;i++){
				var mm = $in.filter('['+v+'="'+i+'"]').find('.mm');

				for(var j = 1 ; j <= 9 ; j++){
					var tmp = mm.filter('[m="' + j + '"]');
					if( tmp.length == 1 ){
						find_one(tmp);
						flag = false;
					}
				}
			}
		});
		//If any mn is only one , that means it's a solution,
		//it's still a tricky things. XD
		$in.has('.mm').each(function(){
			var mm=$(this).find('.mm');
			if(mm.length==1){
				find_one(mm);
				flag = false;
			}
		});

		return flag;
	},
	group:function(sudoku){ //original check_3
		var flag = true,
		    $in=sudoku.getCells();
		// iterate the 9 groups .
		for(var g = 0 ; g < 9 ; g++){
			var mm = $in.filter('[g="' + g + '"]').find('.mm');

			//if the group is already solved , just skip it
			if( mm.length == 0) continue;

			for(var m = 1 ; m <= 9 ; m++){
				var tmp = mm.filter('[m="' + m + '"]');
				var tmp_length = tmp.length;
				if(tmp_length == 0) continue
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
		return flag;
	}
}

function find_one($this){
	$this.siblings('span').html($this.attr('m')).addClass('red');
	$this.siblings('.mm').remove();
	var p=$this.parent('.in');
	sudokubox.updateCells(p);
	$this.remove();
}