/**
 * @fileoverview Test for BoundsBaseCoordinateModel.
 * @author NHN Ent.
 *         FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var BoundsBaseCoordinateModel = require('../../../src/js/components/mouseEventDetectors/boundsBaseCoordinateModel');

describe('Test for BoundsBaseCoordinateModel', function() {
    var coordinateModel;

    beforeEach(function() {
        coordinateModel = new BoundsBaseCoordinateModel([{
            data: {
                groupBounds: []
            },
            chartType: 'column'
        }]);
    });

    describe('_makeRectTypePositionData()', function() {
        it('rect 형태의 그래프로 된 series들의 좌표 data를 생성합니다.', function() {
            var actual = coordinateModel._makeRectTypePositionData([[
                {
                    end: {
                        left: 10,
                        top: 10,
                        width: 20,
                        height: 50
                    }
                }
                ]], 'column');

            expect(actual[0][0].sendData.chartType).toBe('column');
            expect(actual[0][0].sendData.indexes.groupIndex).toBe(0);
            expect(actual[0][0].sendData.indexes.index).toBe(0);
            expect(actual[0][0].sendData.bound).toEqual({
                left: 10,
                top: 10,
                width: 20,
                height: 50
            });
            expect(actual[0][0].bound).toEqual({
                left: 10,
                top: 10,
                right: 30,
                bottom: 60
            });
        });
    });

    describe('_makeDotTypePositionData()', function() {
        it('dot 형태의 그래프로 된 series들의 좌표 data를 생성합니다.', function() {
            var actual = coordinateModel._makeDotTypePositionData([[
                {
                    left: 10,
                    top: 10
                }
            ]], 'line');

            expect(actual[0][0].sendData.chartType).toBe('line');
            expect(actual[0][0].sendData.indexes.groupIndex).toBe(0);
            expect(actual[0][0].sendData.indexes.index).toBe(0);
            expect(actual[0][0].sendData.bound).toEqual({
                left: 10,
                top: 10
            });
            expect(actual[0][0].bound).toEqual({
                left: 6,
                top: 6,
                right: 14,
                bottom: 14
            });
        });
    });

    describe('_joinData()', function() {
        it('join last depth array', function() {
            var actual = coordinateModel._joinData([
                [
                    [{
                        sendData: {
                            indexes: {
                                index: 0
                            },
                            value: 1
                        }
                    }, {
                        sendData: {
                            indexes: {
                                index: 1
                            },
                            value: 2
                        }
                    }],
                    [{
                        sendData: {
                            indexes: {
                                index: 0
                            },
                            value: 3
                        }
                    }, {
                        sendData: {
                            indexes: {
                                index: 1
                            },
                            value: 4
                        }
                    }]
                ], [
                    [{
                        sendData: {
                            indexes: {
                                index: 0
                            },
                            value: 5
                        }
                    }],
                    [{
                        sendData: {
                            indexes: {
                                index: 0
                            },
                            value: 6
                        }
                    }]
                ]
            ]);
            var expected = [
                [{
                    sendData: {
                        indexes: {
                            index: 0
                        },
                        value: 1
                    }
                }, {
                    sendData: {
                        indexes: {
                            index: 1
                        },
                        value: 2
                    }
                }, {
                    sendData: {
                        indexes: {
                            index: 0,
                            legendIndex: 2
                        },
                        value: 5
                    }
                }],
                [{
                    sendData: {
                        indexes: {
                            index: 0
                        },
                        value: 3
                    }
                }, {
                    sendData: {
                        indexes: {
                            index: 1
                        },
                        value: 4
                    }
                }, {
                    sendData: {
                        indexes: {
                            index: 0,
                            legendIndex: 2
                        },
                        value: 6
                    }
                }]
            ];

            expect(actual).toEqual(expected);
        });
        it('should not set "datum.sendData.indexes.legendIndex" without datum', function() {
            var actual = coordinateModel._joinData([
                [
                    [null, {
                        sendData: {
                            indexes: {
                                index: 1
                            },
                            value: 2
                        }
                    }],
                    [{
                        sendData: {
                            indexes: {
                                index: 0
                            },
                            value: 3
                        }
                    }, {
                        sendData: {
                            indexes: {
                                index: 1
                            },
                            value: 4
                        }
                    }]
                ], [
                    [{
                        sendData: {
                            indexes: {
                                index: 0
                            },
                            value: 5
                        }
                    }],
                    [{
                        sendData: {
                            indexes: {
                                index: 0
                            },
                            value: 6
                        }
                    }]
                ]
            ]);
            var expected = [
                [null, {
                    sendData: {
                        indexes: {
                            index: 1
                        },
                        value: 2
                    }
                }, {
                    sendData: {
                        indexes: {
                            index: 0,
                            legendIndex: 2
                        },
                        value: 5
                    }
                }],
                [{
                    sendData: {
                        indexes: {
                            index: 0
                        },
                        value: 3
                    }
                }, {
                    sendData: {
                        indexes: {
                            index: 1
                        },
                        value: 4
                    }
                }, {
                    sendData: {
                        indexes: {
                            index: 0,
                            legendIndex: 2
                        },
                        value: 6
                    }
                }]
            ];

            expect(actual).toEqual(expected);
            expect(actual[0][0]).toEqual(null);
        });
    });

    describe('_makeData()', function() {
        it('make data for detecting mouse event', function() {
            var actual = coordinateModel._makeData([
                {
                    chartType: 'column',
                    data: {
                        groupBounds: [[
                            {
                                end: {
                                    left: 10,
                                    top: 10,
                                    width: 20,
                                    height: 50
                                }
                            }
                        ]]
                    }
                },
                {
                    chartType: 'line',
                    data: {
                        groupPositions: [[
                            {
                                left: 10,
                                top: 10
                            }
                        ]]
                    }
                }
            ]);

            expect(actual[0][0].sendData.chartType).toBe('column');
            expect(actual[0][0].sendData.indexes.groupIndex).toBe(0);
            expect(actual[0][0].sendData.indexes.index).toBe(0);
            expect(actual[0][0].sendData.bound).toEqual({
                left: 10,
                top: 10,
                width: 20,
                height: 50
            });
            expect(actual[0][0].bound).toEqual({
                left: 10,
                top: 10,
                right: 30,
                bottom: 60
            });

            expect(actual[0][1].sendData.chartType).toBe('line');
            expect(actual[0][1].sendData.indexes.groupIndex).toBe(0);
            expect(actual[0][1].sendData.indexes.index).toBe(0);
            expect(actual[0][1].sendData.bound).toEqual({
                left: 10,
                top: 10
            });
            expect(actual[0][1].bound).toEqual({
                left: 6,
                top: 6,
                right: 14,
                bottom: 14
            });
        });
    });

    describe('_findCandidates()', function() {
        it('입력받은 data중에서 layerX, laeryY에 포함되는 후보군을 찾아 반환합니다.', function() {
            var data = [
                    {
                        bound: {
                            left: 10,
                            top: 25,
                            right: 20,
                            bottom: 35
                        },
                        sendData: {
                            bound: {
                                top: 30
                            }
                        }
                    },
                    {
                        bound: {
                            left: 10,
                            top: 20,
                            right: 20,
                            bottom: 30
                        },
                        sendData: {
                            bound: {
                                top: 25
                            }
                        }
                    }
                ],
                layerX = 20,
                layerY = 22,
                actual = coordinateModel._findCandidates(data, layerX, layerY),
                expected = [{
                    bound: {
                        left: 10,
                        top: 20,
                        right: 20,
                        bottom: 30
                    },
                    sendData: {
                        bound: {
                            top: 25
                        }
                    }
                }];

            expect(actual).toEqual(expected);
        })
    });

    describe('findData()', function() {
        it('groupIndex에 해당하는 data 그룹 중 layerX, layerY정보를 포함하는 data 후보군 중에서 layerY에 제일 가까운 data를 찾습니다.', function() {
            var actual, expected;
            coordinateModel.data = [[
                {
                    bound: {
                        left: 10,
                        top: 25,
                        right: 20,
                        bottom: 35
                    },
                    sendData: {
                        bound: {
                            top: 30
                        }
                    }
                },
                {
                    bound: {
                        left: 10,
                        top: 20,
                        right: 20,
                        bottom: 30
                    },
                    sendData: {
                        bound: {
                            top: 25
                        }
                    }
                }
            ]];
            actual = coordinateModel.findData(0, 20, 28);
            expected = coordinateModel.data[0][0].sendData;
            expect(actual).toBe(expected);
        });
    });
});
