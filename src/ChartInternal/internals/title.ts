/**
 * Copyright (c) 2017 ~ present NAVER Corp.
 * billboard.js project is licensed under the MIT license
 */
import {isNumber, setTextValue} from "../../module/util";
import CLASS from "../../config/classes";

/**
 * Get the text position
 * @param {String} pos right, left or center
 * @param {Number} width chart width
 * @return {String|Number} text-anchor value or position in pixel
 * @private
 */
function getTextPos(pos = "left", width?: number | any) {
	const isNum = isNumber(width);
	let position;

	if (pos.indexOf("center") > -1) {
		position = isNum ? width / 2 : "middle";
	} else if (pos.indexOf("right") > -1) {
		position = isNum ? width : "end";
	} else {
		position = isNum ? 0 : "start";
	}

	return position;
}

export default {
	/**
	 * Initializes the title
	 * @private
	 */
	initTitle() {
		const $$ = this;
		const {config, $el} = $$;

		if (config.title_text) {
			$el.title = $el.svg.append("g");

			const text = $el.title
				.append("text")
				.style("text-anchor", getTextPos(config.title_position))
				.attr("class", CLASS.title);

			setTextValue(text, config.title_text, [0.3, 1.5]);
		}
	},

	/**
	 * Redraw title
	 * @private
	 */
	redrawTitle() {
		const $$ = this;
		const {config, state: {currentWidth}, $el: {title}} = $$;

		if (title) {
			const y = $$.yForTitle.call($$);

			if (/g/i.test(title.node().tagName)) {
				title.attr("transform", `translate(${getTextPos(config.title_position, currentWidth)}, ${y})`);
			} else {
				title.attr("x", $$.xForTitle.call($$)).attr("y", y);
			}
		}
	},

	/**
	 * Returns the x attribute value of the title
	 * @private
	 * @returns {Number} x attribute value
	 */
	xForTitle() {
		const $$ = this;
		const {config, state: {currentWidth}} = $$;
		const position = config.title_position || "left";
		const textRectWidth = $$.getTextRect($$.$el.title, CLASS.title).width;
		let x;

		if (/(right|center)/.test(position)) {
			x = currentWidth - textRectWidth;

			if (position.indexOf("right") >= 0) {
				x = currentWidth - textRectWidth - config.title_padding.right;
			} else if (position.indexOf("center") >= 0) {
				x = (currentWidth - textRectWidth) / 2;
			}
		} else { // left
			x = (config.title_padding.left || 0);
		}

		return x;
	},

	/**
	 * Returns the y attribute value of the title
	 * @private
	 * @returns {Number} y attribute value
	 */
	yForTitle() {
		const $$ = this;

		return ($$.config.title_padding.top || 0) +
			$$.getTextRect($$.$el.title, CLASS.title).height;
	},

	/**
	 * Get title padding
	 * @private
	 * @returns {Number} padding value
	 */
	getTitlePadding() {
		const $$ = this;

		return $$.yForTitle() + ($$.config.title_padding.bottom || 0);
	},
};
