tui.util.defineNamespace("fedoc.content", {});
fedoc.content["series_pieChartSeries.js.html"] = "      <div id=\"main\" class=\"main\">\n\n\n\n    \n    <section>\n        <article>\n            <pre class=\"prettyprint source linenums\"><code>/**\n * @fileoverview Pie chart series component.\n * @author NHN Ent.\n *         FE Development Team &lt;dl_javascript@nhnent.com>\n */\n\n'use strict';\n\nvar Series = require('./series'),\n    chartConst = require('../const'),\n    predicate = require('../helpers/predicate'),\n    dom = require('../helpers/domHandler'),\n    renderUtil = require('../helpers/renderUtil'),\n    eventListener = require('../helpers/eventListener');\n\nvar PieChartSeries = tui.util.defineClass(Series, /** @lends PieChartSeries.prototype */ {\n    /**\n     * Line chart series component.\n     * @constructs PieChartSeries\n     * @extends Series\n     * @param {object} params parameters\n     *      @param {object} params.model series model\n     *      @param {object} params.options series options\n     *      @param {object} params.theme series theme\n     */\n    init: function(params) {\n        /**\n         * legend align option.\n         * @type {boolean}\n         */\n        this.legendAlign = params.legendAlign;\n\n        Series.call(this, params);\n    },\n\n    /**\n     * Make sectors information.\n     * @param {array.&lt;number>} percentValues percent values\n     * @param {{cx: number, cy: number, r: number}} circleBound circle bound\n     * @returns {array.&lt;object>} sectors information\n     * @private\n     */\n    _makeSectorData: function(percentValues, circleBound) {\n        var cx = circleBound.cx,\n            cy = circleBound.cy,\n            r = circleBound.r,\n            angle = 0,\n            delta = 10,\n            paths;\n\n        paths = tui.util.map(percentValues, function(percentValue) {\n            var addAngle = chartConst.ANGLE_360 * percentValue,\n                endAngle = angle + addAngle,\n                popupAngle = angle + (addAngle / 2),\n                angles = {\n                    start: {\n                        startAngle: angle,\n                        endAngle: angle\n                    },\n                    end: {\n                        startAngle: angle,\n                        endAngle: endAngle\n                    }\n                },\n                positionData = {\n                    cx: cx,\n                    cy: cy,\n                    angle: popupAngle\n                };\n\n            angle = endAngle;\n\n            return {\n                percentValue: percentValue,\n                angles: angles,\n                centerPosition: this._getArcPosition(tui.util.extend({\n                    r: (r / 2) + delta\n                }, positionData)),\n                outerPosition: {\n                    start: this._getArcPosition(tui.util.extend({\n                        r: r\n                    }, positionData)),\n                    middle: this._getArcPosition(tui.util.extend({\n                        r: r + delta\n                    }, positionData))\n                }\n            };\n        }, this);\n\n        return paths;\n    },\n\n    /**\n     * Make series data.\n     * @param {{\n     *      dimension: {width: number, height: number},\n     *      position: {left: number, top: number}\n     * }} bound series bound\n     * @returns {{\n     *      chartBackground: string,\n     *      circleBound: ({cx: number, cy: number, r: number}),\n     *      sectorData: array.&lt;object>\n     * }} add data for graph rendering\n     */\n    makeSeriesData: function(bound) {\n        var circleBound = this._makeCircleBound(bound.dimension, {\n                showLabel: this.options.showLabel,\n                legendAlign: this.legendAlign\n            }),\n            sectorData = this._makeSectorData(this._getPercentValues()[0], circleBound);\n\n        return {\n            chartBackground: this.chartBackground,\n            circleBound: circleBound,\n            sectorData: sectorData\n        };\n    },\n\n    /**\n     * Make circle bound\n     * @param {{width: number, height:number}} dimension chart dimension\n     * @param {{showLabel: boolean, legendAlign: string}} options options\n     * @returns {{cx: number, cy: number, r: number}} circle bounds\n     * @private\n     */\n    _makeCircleBound: function(dimension, options) {\n        var width = dimension.width,\n            height = dimension.height,\n            isSmallPie = predicate.isOuterLegendAlign(options.legendAlign) &amp;&amp; options.showLabel,\n            radiusRate = isSmallPie ? chartConst.PIE_GRAPH_SMALL_RATE : chartConst.PIE_GRAPH_DEFAULT_RATE,\n            diameter = tui.util.multiplication(tui.util.min([width, height]), radiusRate);\n\n        return {\n            cx: tui.util.division(width, 2),\n            cy: tui.util.division(height, 2),\n            r: tui.util.division(diameter, 2)\n        };\n    },\n\n    /**\n     * Get arc position.\n     * @param {object} params parameters\n     *      @param {number} params.cx center x\n     *      @param {number} params.cy center y\n     *      @param {number} params.r radius\n     *      @param {number} params.angle angle(degree)\n     * @returns {{left: number, top: number}} arc position\n     * @private\n     */\n    _getArcPosition: function(params) {\n        return {\n            left: params.cx + (params.r * Math.sin(params.angle * chartConst.RAD)),\n            top: params.cy - (params.r * Math.cos(params.angle * chartConst.RAD))\n        };\n    },\n\n    /**\n     * Make add data for series label.\n     * @param {object} seriesData series data\n     * @returns {{\n     *      container: HTMLElement,\n     *      options: {legendAlign: string, showLabel: boolean},\n     *      chartWidth: number\n     * }} add data for make series label\n     * @private\n     */\n    _makeSeriesDataForSeriesLabel: function(seriesData) {\n        return tui.util.extend({\n            options: {\n                legendAlign: this.legendAlign,\n                showLabel: this.options.showLabel\n            },\n            chartWidth: this.data.chartWidth\n        }, seriesData);\n    },\n\n    /**\n     * Render raphael graph.\n     * @param {{width: number, height: number}} dimension dimension\n     * @param {object} seriesData series data\n     * @private\n     * @override\n     */\n    _renderGraph: function(dimension, seriesData) {\n        var funcShowTooltip = tui.util.bind(this.showTooltip, this, {\n                allowNegativeTooltip: !!this.allowNegativeTooltip,\n                chartType: this.chartType\n            }),\n            callbacks = {\n                funcShowTooltip: funcShowTooltip,\n                funcHideTooltip: tui.util.bind(this.hideTooltip, this),\n                funcSelectSeries: tui.util.bind(this.selectSeries, this)\n            },\n            params = this._makeParamsForGraphRendering(dimension, seriesData);\n\n        this.graphRenderer.render(this.seriesContainer, params, callbacks);\n    },\n\n    /**\n     * Render series component of pie chart.\n     * @param {{\n     *      dimension: {width: number, height: number},\n     *      position: {left: number, top: number}\n     * }} bound series bound\n     * @param {object} data data for rendering\n     * @returns {HTMLElement} series element\n     * @override\n     */\n    render: function() {\n        var el = Series.prototype.render.apply(this, arguments);\n        this.attachEvent(el);\n\n        return el;\n    },\n\n    /**\n     * Resize.\n     * @override\n     */\n    resize: function() {\n        Series.prototype.resize.apply(this, arguments);\n        this._moveLegendLines(this.seriesData);\n        this._updateContainerBound();\n    },\n\n    /**\n     * showTooltip is mouseover event callback on series graph.\n     * @param {object} params parameters\n     *      @param {boolean} params.allowNegativeTooltip whether allow negative tooltip or not\n     * @param {{top:number, left: number, width: number, height: number}} bound graph bound information\n     * @param {number} groupIndex group index\n     * @param {number} index index\n     * @param {{clientX: number, clientY: number}} eventPosition mouse event position\n     */\n    showTooltip: function(params, bound, groupIndex, index, eventPosition) {\n        this.fire('showTooltip', tui.util.extend({\n            indexes: {\n                groupIndex: groupIndex,\n                index: index\n            },\n            bound: bound,\n            eventPosition: eventPosition\n        }, params));\n    },\n\n    /**\n     * hideTooltip is mouseout event callback on series graph.\n     * @param {string} id tooltip id\n     */\n    hideTooltip: function() {\n        this.fire('hideTooltip');\n    },\n\n    /**\n     * Make series data by selection.\n     * @param {number} index index\n     * @returns {{indexes: {index: number, groupIndex: number}}} series data\n     * @private\n     */\n    _makeSeriesDataBySelection: function(index) {\n        return {\n            indexes: {\n                index: index,\n                groupIndex: index\n            }\n        };\n    },\n\n    /**\n     * selectSeries is click event callback on series graph.\n     * @param {number} index index\n     */\n    selectSeries: function(index) {\n        var seriesData = this._makeSeriesDataBySelection(index);\n        if (this.selectedIndex === index) {\n            this.onUnselectSeries(seriesData);\n            delete this.selectedIndex;\n        } else {\n            if (!tui.util.isUndefined(this.selectedIndex)) {\n                this.onUnselectSeries(this._makeSeriesDataBySelection(this.selectedIndex));\n            }\n            this.onSelectSeries(seriesData);\n            this.selectedIndex = index;\n        }\n    },\n\n    /**\n     * Get series label.\n     * @param {object} params parameters\n     *      @param {string} params.legend legend\n     *      @param {string} params.label label\n     *      @param {string} params.separator separator\n     *      @param {{legendAlign: ?string, showLabel: boolean}} params.options options\n     * @returns {string} series label\n     * @private\n     */\n    _getSeriesLabel: function(params) {\n        var seriesLabel = '';\n\n        if (params.options.legendAlign) {\n            seriesLabel = '&lt;span class=\"tui-chart-series-legend\">' + params.legend + '&lt;/span>';\n        }\n\n        if (params.options.showLabel) {\n            seriesLabel += (seriesLabel ? params.separator : '') + params.label;\n        }\n\n        return seriesLabel;\n    },\n\n    /**\n     * Render center legend.\n     * @param {object} params parameters\n     *      @param {array.&lt;object>} params.positions positions\n     *      @param {string} params.separator separator\n     *      @param {object} params.options options\n     *      @param {function} params.funcMoveToPosition function\n     * @param {HTMLElement} seriesLabelContainer series label area element\n     * @private\n     */\n    _renderLegendLabel: function(params, seriesLabelContainer) {\n        var positions = params.positions,\n            html;\n\n        html = tui.util.map(this.dataProcessor.getLegendLabels(), function(legend, index) {\n            var label = this._getSeriesLabel({\n                    legend: legend,\n                    label: this.dataProcessor.getFormattedValue(0, index, this.chartType),\n                    separator: params.separator,\n                    options: params.options\n                }),\n                position = params.funcMoveToPosition(positions[index], label);\n            return this._makeSeriesLabelHtml(position, label, 0, index);\n        }, this).join('');\n        seriesLabelContainer.innerHTML = html;\n    },\n\n    /**\n     * Move to center position.\n     * @param {{left: number, top: number}} position position\n     * @param {string} label label\n     * @returns {{left: number, top: number}} center position\n     * @private\n     */\n    _moveToCenterPosition: function(position, label) {\n        var left = position.left - (renderUtil.getRenderedLabelWidth(label, this.theme.label) / 2),\n            top = position.top - (renderUtil.getRenderedLabelHeight(label, this.theme.label) / 2);\n\n        return {\n            left: left,\n            top: top\n        };\n    },\n\n    /**\n     * Render center legend.\n     * @param {object} params parameters\n     *      @param {object} params.sectorData sector info\n     * @param {HTMLElement} seriesLabelContainer series label area element\n     * @private\n     */\n    _renderCenterLegend: function(params, seriesLabelContainer) {\n        this._renderLegendLabel(tui.util.extend({\n            positions: tui.util.pluck(params.sectorData, 'centerPosition'),\n            funcMoveToPosition: tui.util.bind(this._moveToCenterPosition, this),\n            separator: '&lt;br>'\n        }, params), seriesLabelContainer);\n    },\n\n    /**\n     * Add end position.\n     * @param {number} centerLeft center left\n     * @param {array.&lt;object>} positions positions\n     * @private\n     */\n    _addEndPosition: function(centerLeft, positions) {\n        tui.util.forEach(positions, function(position) {\n            var end = tui.util.extend({}, position.middle);\n            if (end.left &lt; centerLeft) {\n                end.left -= chartConst.SERIES_OUTER_LABEL_PADDING;\n            } else {\n                end.left += chartConst.SERIES_OUTER_LABEL_PADDING;\n            }\n            position.end = end;\n        });\n    },\n\n    /**\n     * Move to outer position.\n     * @param {number} centerLeft center left\n     * @param {object} position position\n     * @param {string} label label\n     * @returns {{left: number, top: number}} outer position\n     * @private\n     */\n    _moveToOuterPosition: function(centerLeft, position, label) {\n        var positionEnd = position.end,\n            left = positionEnd.left,\n            top = positionEnd.top - (renderUtil.getRenderedLabelHeight(label, this.theme.label) / 2);\n\n        if (left &lt; centerLeft) {\n            left -= renderUtil.getRenderedLabelWidth(label, this.theme.label) + chartConst.SERIES_LABEL_PADDING;\n        } else {\n            left += chartConst.SERIES_LABEL_PADDING;\n        }\n\n        return {\n            left: left,\n            top: top\n        };\n    },\n\n    /**\n     * Render outer legend.\n     * @param {object} params parameters\n     *      @param {object} params.sectorData sector info\n     *      @param {number} params.chartWidth chart width\n     * @param {HTMLElement} seriesLabelContainer series label area element\n     * @private\n     */\n    _renderOuterLegend: function(params, seriesLabelContainer) {\n        var outerPositions = tui.util.pluck(params.sectorData, 'outerPosition'),\n            centerLeft = params.chartWidth / 2;\n\n        this._addEndPosition(centerLeft, outerPositions);\n        this._renderLegendLabel(tui.util.extend({\n            positions: outerPositions,\n            funcMoveToPosition: tui.util.bind(this._moveToOuterPosition, this, centerLeft),\n            separator: ':&amp;nbsp;'\n        }, params), seriesLabelContainer);\n\n        this.graphRenderer.renderLegendLines(outerPositions);\n    },\n\n    /**\n     * Render series label.\n     * @param {object} params parameters\n     * @param {HTMLElement} seriesLabelContainer series label area element\n     * @private\n     */\n    _renderSeriesLabel: function(params, seriesLabelContainer) {\n        var legendAlign = params.options.legendAlign;\n\n        if (predicate.isOuterLegendAlign(legendAlign)) {\n            this._renderOuterLegend(params, seriesLabelContainer);\n        } else {\n            this._renderCenterLegend(params, seriesLabelContainer);\n        }\n    },\n\n    /**\n     * Animate showing about series label area.\n     * @override\n     */\n    animateShowingAboutSeriesLabelArea: function() {\n        this.graphRenderer.animateLegendLines();\n        Series.prototype.animateShowingAboutSeriesLabelArea.call(this);\n    },\n\n    /**\n     * Move legend lines.\n     * @param {object} seriesData series data\n     * @private\n     * @override\n     */\n    _moveLegendLines: function(seriesData) {\n        var outerPositions = tui.util.pluck(seriesData.sectorData, 'outerPosition'),\n            centerLeft = this.data.chartWidth / 2;\n\n        this._addEndPosition(centerLeft, outerPositions);\n        this.graphRenderer.moveLegendLines(outerPositions);\n    },\n\n    /**\n     * Handle mouse event.\n     * @param {MouseEvent} e mouse event\n     * @param {function} callback callback\n     * @private\n     */\n    _handleMouseEvent: function(e, callback) {\n        var elTarget = e.target || e.srcElement,\n            elLabel = this._findLabelElement(elTarget),\n            groupIndex, index;\n\n        if (!elLabel) {\n            return;\n        }\n\n        groupIndex = parseInt(elLabel.getAttribute('data-group-index'), 10);\n        index = parseInt(elLabel.getAttribute('data-index'), 10);\n\n        if (groupIndex === -1 || index === -1) {\n            return;\n        }\n\n        callback(groupIndex, index, elTarget);\n    },\n\n    /**\n     * Find legend element.\n     * @param {HTMLElement} elTarget target element\n     * @returns {HTMLElement} legend element\n     * @private\n     */\n    _findLegendElement: function(elTarget) {\n        var elLegend;\n\n        if (dom.hasClass(elTarget, chartConst.CLASS_NAME_SERIES_LEGEND)) {\n            elLegend = elTarget;\n        }\n\n        return elLegend;\n    },\n\n    /**\n     * On click event handler.\n     * @param {MouseEvent} e mouse event\n     * @private\n     * @override\n     */\n    _onClick: function(e) {\n        var that = this;\n        this._handleMouseEvent(e, function(groupIndex, index, elTarget) {\n            var elLegend = that._findLegendElement(elTarget),\n                legendData;\n\n            if (!elLegend) {\n                that.selectSeries(index);\n            } else {\n                legendData = that.dataProcessor.getLegendData(index);\n                that.userEvent.fire('selectLegend', {\n                    legend: legendData.label,\n                    chartType: legendData.chartType,\n                    legendIndex: index,\n                    index: index\n                });\n            }\n        });\n    },\n\n    /**\n     * Update container bound.\n     * @private\n     */\n    _updateContainerBound: function() {\n        this.containerBound = this.seriesContainer.getBoundingClientRect();\n    },\n\n    /**\n     * Get series container bound.\n     * @returns {{left: number, top: number}} container bound\n     * @private\n     */\n    _getContainerBound: function() {\n        if (!this.containerBound) {\n            this._updateContainerBound();\n        }\n        return this.containerBound;\n    },\n\n    /**\n     * Make label bound.\n     * @param {number} clientX clientX\n     * @param {number} clientY clientY\n     * @returns {{left: number, top: number}} bound\n     * @private\n     */\n    _makeLabelBound: function(clientX, clientY) {\n        var containerBound = this._getContainerBound();\n        return {\n            left: clientX - containerBound.left,\n            top: clientY - containerBound.top\n        };\n    },\n\n    /**\n     * This is event handler for mouseover.\n     * @private\n     * @param {MouseEvent} e mouse event\n     */\n    _onMouseover: function(e) {\n        var that = this;\n\n        this._handleMouseEvent(e, function(groupIndex, index) {\n            var bound = that._makeLabelBound(e.clientX, e.clientY - 10);\n            that.showTooltip({\n                allowNegativeTooltip: !!that.allowNegativeTooltip,\n                chartType: that.chartType\n            }, bound, groupIndex, index);\n        });\n    },\n\n    /**\n     * This is event handler for mouseout.\n     * @private\n     * @param {MouseEvent} e mouse event\n     */\n    _onMouseout: function(e) {\n        var that = this;\n\n        this._handleMouseEvent(e, function(groupIndex, index) {\n            that.hideTooltip(groupIndex, index);\n        });\n    },\n\n    /**\n     * Attach event\n     * @param {HTMLElement} el target element\n     */\n    attachEvent: function(el) {\n        eventListener.bindEvent('click', el, tui.util.bind(this._onClick, this));\n        eventListener.bindEvent('mouseover', el, tui.util.bind(this._onMouseover, this));\n        eventListener.bindEvent('mouseout', el, tui.util.bind(this._onMouseout, this));\n    }\n});\n\ntui.util.CustomEvents.mixin(PieChartSeries);\n\nmodule.exports = PieChartSeries;\n</code></pre>\n        </article>\n    </section>\n\n\n\n</div>\n\n"