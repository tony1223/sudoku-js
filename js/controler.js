/**
 * The controller for main.html We mean a controller
 */


var sudokubox2 = new SudokuBox( $('.box'), {
	// a log for easy to build a test case
		afterInput : function(r, c, value) {
			$("#gen-result").val(
					$("#gen-result").val() + "\nsudokubox.input(" + r + ", "
							+ c + ", " + value + ");");
		}
	});

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
	var flag = SolveStrategy.one(sudokubox2);
	if (SolveStrategy.one(sudokubox2)) { // if nothing changes
		// if there not any existing empty cell ,
		// it means game is over now.
		if ($('.mm').length == 0) {
			$('.info').html('結束');
			return;
		}

		if (SolveStrategy.group(sudokubox2)) {
			if (SolveStrategy.check_4(sudokubox2)) {
				if (SolveStrategy.check_5(sudokubox2)) {
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