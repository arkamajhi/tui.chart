/**
 * @fileoverview Radial chart.
 * @author NHN Ent.
 *         FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var ChartBase = require('./chartBase');
var Series = require('../components/series/lineChartSeries');

var RadialChart = tui.util.defineClass(ChartBase, /** @lends RadialChart.prototype */ {
    /**
     * className
     * @type {string}
     */
    className: 'tui-radial-chart',

    /**
     * Series class
     * @type {function}
     */
    Series: Series,

    /**
     * Radial chart.
     * @constructs RadialChart
     * @extends ChartBase
     * @param {Array.<Array>} rawData raw data
     * @param {object} theme chart theme
     * @param {object} options chart options
     */
    init: function(rawData, theme, options) {
        // Radial차트는 그룹툴팁을 지원하지 않음, 지원하게되면 아래 코드 삭제
        if (options.tooltip) {
            options.tooltip.grouped = false;
        }

        ChartBase.call(this, {
            rawData: rawData,
            theme: theme,
            options: options,
            hasAxes: true,
            isVertical: true
        });
    },
    /**
     * Add components
     * @override
     */
    addComponents: function() {
        this.componentManager.register('title', 'title');
        this.componentManager.register('legend', 'legend');
        this.componentManager.register('plot', 'radialPlot');

        this.componentManager.register('radialSeries', 'radialSeries');

        this.componentManager.register('chartExportMenu', 'chartExportMenu');
        this.componentManager.register('tooltip', 'tooltip');
        this.componentManager.register('mouseEventDetector', 'mouseEventDetector');
    },
    /**
     * Add data ratios.
     * @override
     */
    addDataRatios: function(limitMap) {
        this.dataProcessor.addDataRatios(limitMap[this.chartType], null, this.chartType);
    },

    /**
     * Get scale option.
     * @returns {{xAxis: ?{valueType:string}, yAxis: ?(boolean|{valueType:string})}}
     * @override
     */
    getScaleOption: function() {
        return {
            yAxis: {}
        };
    }
});

module.exports = RadialChart;
