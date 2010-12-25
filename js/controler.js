/**
 * The controller for main.html We mean a controller
 */

var box = $('.box');

var sudokubox = new SudokuBox(box, {
	// a log for easy to build a test case
		afterInput : function(r, c, value) {
			$("#gen-result").val(
					$("#gen-result").val() + "\nsudokubox.input(" + r + ", "
							+ c + ", " + value + ");");
		}
	});
sudokubox.bindCell();

/**
 * Start to resolve the soduku. (The event handler for the button)
 *
 * @return
 */
function solve() {
	// remove old result
	$('span').removeClass('red');
	_solve();
}

function _solve() {
	var flag = SolveStrategy.one(sudokubox);
	if (SolveStrategy.one(sudokubox)) { // if nothing changes
		// if there not any existing empty cell ,
		// it means game is over now.
		if ($('.mm').length == 0) {
			$('.info').html('結束');
			return;
		}

		if (SolveStrategy.group(sudokubox)) {
			if (SolveStrategy.check_4(sudokubox)) {
				if (check_5()) {
					$('.info').html('結束');
				} else {
					_solve();
				}
			} else {
				_solve();
			}
		} else {
			_solve();
		}

	} else {
		// if it change something , we just run it again after and run again.
		// because if you fill a cell , it will effect other cell's number(mn).
		setTimeout(_solve, 500);
	}
}
$('#check_ok2').click(solve);