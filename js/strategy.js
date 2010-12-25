/**
 * We create a strategy class for how to solve sudoku. each return a boolean for
 * finding solution or not.
 */
var SolveStrategy = {

	one : function(sudoku) { // original check_1
		var flag = true, $in = sudoku.getCells();

		// Here to find which line/group is already feed eight number,
		// and it will auto fill the last number for it .
		// Here's a bit too tricky for me. :P
		$.each( [ 'r', 'c', 'g' ], function(k, v) {
			for ( var i = 0; i < 9; i++) {
				var mm = $in.filter('[' + v + '="' + i + '"]').find('.mm');

				for ( var j = 1; j <= 9; j++) {
					var tmp = mm.filter('[m="' + j + '"]');
					if (tmp.length == 1) {
						sudoku.inputByMn(tmp, true);
						flag = false;
					}
				}
			}
		});
		// If any mn is only one , that means it's a solution,
		// it's still a tricky things. XD
		$in.has('.mm').each(function() {
			var mm = $(this).find('.mm');
			if (mm.length == 1) {
				sudoku.inputByMn(mm, true);
				flag = false;
			}
		});

		return flag;
	},
	group : function(sudoku) { // original check_3
		var flag = true, $in = sudoku.getCells();
		// iterate the 9 groups .
		for ( var g = 0; g < 9; g++) {
			var mm = $in.filter('[g="' + g + '"]').find('.mm');

			// if the group is already solved , just skip it
			if (mm.length == 0)
				continue;

			for ( var m = 1; m <= 9; m++) {
				var tmp = mm.filter('[m="' + m + '"]');
				var tmp_length = tmp.length;
				if (tmp_length == 0)
					continue
				var p = tmp.parent();
				var r = p.eq(0).attr('r');
				var c = p.eq(0).attr('c');
				var t_r = p.filter('[r="' + r + '"]');
				var t_c = p.filter('[c="' + c + '"]');
				if (t_r.length == p.length) {
					var target = $in.filter('[r="' + r + '"]').not(p).find(
							'.mm[m="' + m + '"]');
					if (target.length > 0) {
						flag = false;
						target.remove();
					}
				}
				if (t_c.length == p.length) {
					var target = $in.filter('[c="' + c + '"]').not(p).find(
							'.mm[m="' + m + '"]');
					if (target.length > 0) {
						flag = false;
						target.remove();
					}
				}
			}
		}
		return flag;
	},
	check_4 : function(sudoku) {
		var flag = true, $in = sudoku.getCells();
		$.each( [ 'r', 'c', 'g' ], function(k, v) {
			for ( var i = 0; i < 9; i++) {
				var tmp = $in.filter('[' + v + '="' + i + '"]').has('.mm');
				if (!check_4_1(tmp)) {
					flag = false;
				}
				if (!check_4_2(tmp)) {
					flag = false;
				}
			}
		});

		return flag;
	},
	check_5 : function(sudoku) {
		var flag = true, $in = sudoku.getCells();
		;
		var type = [ 'r', 'c' ];
		$.each( [ 'r', 'c', 'g' ], function(k, v) {
			for ( var a = 0; a < 8; a++) {
				for ( var m = 1; m <= 9; m++) {
					var mm = $in.filter('[' + v + '="' + a + '"]').find(
							'.mm[m="' + m + '"]');
					if (mm.length != 2)
						continue;
					for ( var b = a + 1; b < 9; b++) {
						var nn = $in.filter('[' + v + '="' + b + '"]').find(
								'.mm[m="' + m + '"]');
						if (nn.length != 2)
							continue;
						var g = (v == 'r') ? 'c' : 'r';
						var c = mm.eq(0).parent().attr(g);
						var d = mm.eq(1).parent().attr(g);
						if (nn.eq(0).parent().attr(g) == c
								&& nn.eq(1).parent().attr(g) == d) {
							var target = $in.filter(
									'[' + g + '="' + c + '"],[' + g + '="' + d
											+ '"]').find('.mm[m="' + m + '"]')
									.not(mm).not(nn);
							if (target.length > 0) {
								flag = false;
								target.remove();
							}
						}
					}
				}
			}
		});
		return flag;
	}
}

function check_4_1(tmp) {
	var flag = true;
	for ( var m = 1; m < 9; m++) {
		var mm = tmp.find('.mm[m="' + m + '"]');
		if (mm.length != 2)
			continue
		for ( var n = m + 1; n <= 9; n++) {
			var nn = tmp.find('.mm[m="' + n + '"]');
			if (nn.length != 2)
				continue
			if (mm.eq(0).parent().get(0) == nn.eq(0).parent().get(0)
					&& mm.eq(1).parent().get(0) == nn.eq(1).parent().get(0)) {
				var target = mm.parent().find('.mm').not(nn).not(mm);
				if (target.length > 0) {
					target.remove();
					flag = false;
				}
			}
		}
	}
	return flag;
}
function check_4_2(tmp) {
	var flag = true;
	var tmp_length = tmp.length;
	for ( var m = 0; m < tmp_length - 1; m++) {
		var mm = tmp.eq(m).find('.mm');
		if (mm.length != 2)
			continue;
		for (n = m + 1; n < tmp_length; n++) {
			var nn = tmp.eq(n).find('.mm');
			if (nn.length != 2)
				continue;
			var a = mm.eq(0).attr('m');
			var b = mm.eq(1).attr('m');
			if (nn.eq(0).attr('m') == a && nn.eq(1).attr('m') == b) {
				var target = tmp.find('.mm').filter(
						'[m="' + a + '"],[m="' + b + '"]').not(mm).not(nn);
				if (target.length > 0) {
					target.remove();
					flag = false;
				}
			}
		}
	}
	return flag;
}
