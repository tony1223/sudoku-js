/**
 * widget shouldn't depend on page , so we seperate from html page
 */

/**
 * init for sudoku box
 *
 * @param opts
 *
 * <pre>
 *    Allowed options:
 *    Events: (All the event handler's &quot;this&quot; is SudokuBox.)
 *    	afterInput , trigger after use input , function(r,c,value)
 * 	onError , trigger when user input error , function(userInputValue, aryAllowValues)
 *
 *
 * </pre>
 */
function SudokuBox(context, opts) {
	var that = this, out = [];
	if (opts) {
		if (opts.afterInput)
			this._doAfterInput = opts.afterInput;
		if (opts.onError)
			this.onError = opts.onError;
	}

	// add every number helper (1-9) each cell here.

	this.uuid = "sud" + (++SudokuBox.uuid);
	this.context = context;

	for ( var i = 0; i < 9; i++) {
		for ( var j = 0; j < 9; j++) {
			var c = i;
			var r = j;
			var g = Math.floor(i / 3) * 3 + Math.floor(j / 3);
			out.push('<div id="', this.uuid, '-', r, '-', c, '" class="in c',
					c, ' r', r, ' g', g, '" r="', r, '" c="', c, '" g="', g,
					'">', '<span></span>');

			for ( var m = 1; m <= 9; m++) {
				var t = 3 + Math.floor((m - 1) / 3) * 12;
				var l = 3 + Math.floor((m - 1) % 3) * 12;
				out.push('<div id="', this.uuid, '-', r, '-', c, '-', m,
						'" class="mm num" m="', m, '" style="top:', t,
						'px;left:', l, 'px">', m, '</div>');
			}

			out.push('</div>');
		}
	}
	context.append(out.join(""));

	context
			.append('<div class="put" style="display:none;">' + '<input style="width:20px;height:20px;" type="text" /></div>');

	this._cells = this.find(".in");
	this._put = this.find(".put");

	this._put
			.find("input")
			.keyup(
					function() {
						var current = that._current, r = current.attr('r'), c = current
								.attr('c'), value = $(this).val(), allows = [], verify = false;

						current.find(".mm").each(
								function() {
									var currentVal = $(this).attr("m");
									allows.push(currentVal);

									if (parseInt(currentVal, 10) == parseInt(
											value, 10))
										verify = true;

								});

						if (verify) {
							that.input(r, c, $(this).val());
						} else {
							// a callback for user customize event
							if ($.isFunction(this.onError))
								this.onError.apply(this, [ value, allows ]);
							else
								alert("input [" + value
										+ "] error , only allow " + allows);
						}
						this.value = ""; // clear value after typing
						that._put.hide();

					}).focusout(function() {
				this._current = null;
				that._put.hide();
				that.getCells().removeClass('fo');
			});

	this.bindCell();
}

/**
 * static variables / methods
 */
SudokuBox.uuid = 0;

/**
 * isntance methods
 */
SudokuBox.prototype = {
	/**
	 * bind cell event after cell is created
	 *
	 * @return SudukuBox
	 */
	bindCell : function() {
		var that = this;
		this.getCells().click(function() {
			that.startUserInput($(this));
		});
		return this;
	},
	/**
	 * focus all the related cells , including the horizontal line , the
	 * vertical line and the groups.
	 *
	 * @param r
	 *            horizontal index from 0 ~ 8
	 * @param c
	 *            vertical index from 0 ~ 8
	 * @param g
	 *            group , 3*3 cells for a group , it's in order from left to
	 *            right ,
	 *
	 * <pre>
	 * 0, 1, 2, 3, 4, 5, 6, 7, 8
	 * </pre>
	 *
	 * @return SudukuBox
	 */
	focusCells : function($tar) {
		var $in = this.getCells();
		$in.removeClass('fo');

		this.getRelativeCell($tar).addClass('fo');
		return this;
	},
	/**
	 * update cells for remove the user entered number, if user eneter "1" , all
	 * the cell for the horizontal line , the vertical line and the groups
	 * should not exist "1".
	 *
	 * @param activeCell ,
	 *            we use the cell's value to update cells.
	 * @return
	 *
	 * @Todo here's a bug if user modify the number twice , it will be
	 *       incorrect.
	 */
	updateCells : function(activeCell) {
		var n = activeCell.find('span').html();
		// remove all the numbers in cell
		activeCell.find('.mm').removeClass("mm");
		this.getRelativeCell(activeCell).find('.mm[m="' + n + '"]')
				.removeClass("mm");

		return this;
	},
	getRelativeCell : function(activeCell) {
		var r = activeCell.attr('r'), c = activeCell.attr('c'), g = activeCell
				.attr('g');

		return this.find('div.in.r' + r + ',div.in.c' + c + ',div.in.g' + g);
	},

	/**
	 * get all the cell
	 *
	 * @return
	 */
	getCells : function() {
		return this._cells;
	},
	/**
	 * we need to hide numbers when user is tpying his number. This implement is
	 * too low-end , that any user should not call this function directly.
	 *
	 * @param activeCell
	 * @return
	 */
	/* private */_maskCell : function(activeCell) {
		/**
		 * we use a div to overlap the cells numbers , and we call it "put"
		 */
		var txt = (activeCell.css('margin-top').replace(/px/gi, "")),
		// use parseInt(xxx , 10) instead parseInt(xxx)
		// to prevent Octal number issue.
		t = activeCell.position().top + parseInt(txt, 10), l = activeCell
				.position().left;

		this._put.css( {
			left : l,
			top : t
		}).show();
		this._put.find("input").focus();
		return this;
	},
	/**
	 *
	 * @param $tar
	 * @return
	 * @Todo a warning for user entered a already exist number.
	 */
	startUserInput : function($tar) {
		this._current = $tar;
		this._maskCell($tar);
		this.focusCells($tar);
		return this;
	},
	/**
	 * return selected cell as jQuery context.
	 */
	findCell : function(r, c) {
		return this.find("#" + this.uuid + '-' + r + '-' + c);
	},
	findMM : function(r, c, m) {
		return this.find("#" + this.uuid + '-' + r + '-' + c + '-' + m);
	},
	/**
	 * for input a word
	 */
	input : function(r, c, value, solved) {
		var activeCell = this.findCell(r, c), span = activeCell.find('span');

		span.html(value);
		activeCell.addClass("inputed");
		this.updateCells(activeCell);

		if (solved)
			span.addClass('red');

		// a callback for user customize event
		if ($.isFunction(this._doAfterInput))
			this._doAfterInput.apply(this, [ r, c, value ]);

		return this;
	},

	/**
	 * remove MM width mm
	 * overloading method.
	 * @param r the MM dom/jQuery context
	 * @return
	 */
	/**
	 * remove MM width r,c,num
	 * @param r
	 * @param c
	 * @param num
	 * @return
	 */
	removeMM : function(r, c, num) {
		if($(r).is(".mm")){
			$(r).removeClass("mm");
		}else
			this.findMM(r,c,num).removeClass("mm");
		return this;
	},
	/**
	 * cancel input state.
	 *
	 * @param r
	 * @param c
	 * @return
	 */
	cancelInput : function(r, c) {
	},
	/**
	 * find in the sudoku context
	 */
	find : function(selector) {
		return this.context.find(selector);
	},
	/**
	 *  @param type : r,c,g
	 *  @param num the value of type
	 */
	findByType : function(type,num) {
		return this.context.find('.' + type + ''+ num);
	},
	/**
	 * input the cell value with the mn value
	 *
	 * @param mn
	 *            the target cell's mn
	 * @return
	 */
	inputByMn : function(mn, solved) {
		var activeCell = mn.parent(), value = mn.attr('m');
		this.input(activeCell.attr("r"), activeCell.attr("c"), value, solved);
	},
	/**
	 *
	 */
	exportJSON : function() {
		var json = [];
		this.find(".inputed").each(
				function() {
					var $this = $(this);
					json.push("[" + $this.attr("r") + "," + $this.attr("c")
							+ "," + $this.find("span").text() + "]\n");
				});
		return "[" + json.join(",") + "]";
	},
	importJSON : function(json) {
		for ( var ind = 0, len = json.length; ind < len; ++ind) {
			this.input(json[ind][0], json[ind][1], json[ind][2]);
		}
	}
};
