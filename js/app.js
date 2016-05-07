var http_config = {
    headers: {
        'Content-Type': undefined
    },
};
var divider = 0;

var simpleChartConfig = {
    options: {
        chart: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            height: 100,
            width: 240,
            zoomType: 'x'
        },
        rangeSelector: {
            enabled: false
        },
        navigator: {
            enabled: false
        },
        scrollbar: {
            enabled: false
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            lineWidth: 1,
            opposite: false,
            labels: {
                align: 'right',
                x: -5
            }
        }

    },
    series: [],
    useHighStocks: true
};
var extendedChartConfig = {
    options: {
        chart: {
            zoomType: 'x'
        },
        rangeSelector: {
            enabled: true
        },
        navigator: {
            enabled: true,
            series: {
                id: 'navigator'
            }
        },
        scrollbar: {
            enabled: true
        }
    },
    series: [],
    title: {
        text: 'Chart'
    },
    useHighStocks: true
}


var app = angular.module("pools", ['angularMoment', 'highcharts-ng', 'LocalStorageModule']);

app.directive('innerVar', function() {
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            var splits = attrs.innerVar.split("=");
            scope.$watch(splits[1], function(val) {
                scope.$eval(attrs.innerVar);
            });
        }
    };
});


app.factory('HeaderService', function($window, $location, $rootScope) {
    return {
        changeCurrency: function(o) {
            $location.search("name", o.name);
            $window.location.href = $location.absUrl();
        }
    };
});

app.factory('blockFactory', function($http) {
    return {
        last: function(pool, stats) {
            var data = JSON.stringify({
                jsonrpc: "2.0",
                id: "test",
                method: "f_block_json",
                params: {
                    hash: stats.last_block
                }
            });
            return $http.post(pool.daemonrpc + "json_rpc", data, http_config);
        }
    }
});


app.factory('poolsFactory', function($rootScope) {
    messages = [];

    var conn = new WebSocket(websocket_pools);
    // called when the server closes the connection
    conn.onclose = function(e) {
        $rootScope.$apply(function() {
            messages.push("DISCONNECTED");
        });
    };
    // called when the connection to the server is made
    conn.onopen = function(e) {
        $rootScope.$apply(function() {
            messages.push("CONNECTED");
        })
    };
    // called when a message is received from the server
    conn.onmessage = function(e) {
        $rootScope.$apply(function() {
            data = JSON.parse(e.data);
            $rootScope.pools = data.pools;
        });
    };
});


app.factory('poolsStatsFactory', function($rootScope) {
    messages = [];

    var conn = new WebSocket(websocket_currencies);
    // called when the server closes the connection
    conn.onclose = function(e) {
        $rootScope.$apply(function() {
            messages.push("DISCONNECTED");
        });
    };
    // called when the connection to the server is made
    conn.onopen = function(e) {
        $rootScope.$apply(function() {
            messages.push("CONNECTED");
        })
    };
    // called when a message is received from the server
    conn.onmessage = function(e) {
        $rootScope.$apply(function() {
            $rootScope.currencies = JSON.parse(e.data);
        });
    };
});

app.controller("MainCtl", ["$scope", "$filter", "$http", "localStorageService", "poolsFactory", "poolsStatsFactory", function($scope, $filter, $http, localStorageService, poolsFactory, poolsStatsFactory) {
    $scope.addresses = localStorageService.get("addresses") || [];

    $scope.changeExamplePool = function(o) {
        $scope.selected_pool = o;
    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByTicker')($scope.pools, "DSH");
    });


    $scope.$watchCollection('[selected_pool, currencies]', function() {
        angular.forEach($scope.addresses, function(address, index) {
            var pool = $filter('getByName')($scope.pools, address.currency);

            $http.get(pool.poolrpc + "stats_address?address=" + address.address, http_config).success(function(data, status) {
                address.address_stats = data;
            });
        });
    });

}]);

app.controller("PoolIndexCtl", ["$scope", '$sce', "$filter", "$http", "localStorageService", "HeaderService", "poolsFactory", "poolsStatsFactory", function($scope, $sce, $filter, $http, localStorageService, HeaderService, poolsFactory, poolsStatsFactory) {
    $scope.currency_name = $filter('lowercase')(urlParam('name'));
    $scope.cryptonator_data = [];
    $scope.current_date = new Date();
    $scope.calcUnits = 1
    $scope.calcUnitName = 'KH';
    $scope.chatURL = '';
    $scope.populatedCharts = false;
    $scope.addresses = localStorageService.get("addresses") || [];

    $scope.changePool = function(o) {
        $scope.selected_pool = o;
    }

    $scope.addAddress = function() {
        if (!$scope.selected_pool.name || !$scope.newAddress)
            return;

        var pool = $filter('getByName')($scope.pools, $scope.selected_pool.name);
        $http.get(pool.poolrpc + "stats_address?address=" + $scope.newAddress, http_config).success(function(data, status) {
            if (!data.error) {
                var addresses = $scope.addresses;
                addresses.unshift({
                    currency: $scope.selected_pool.name,
                    address: $scope.newAddress
                });
                addresses = $filter('unique')(addresses, ['address', 'currency']);
                localStorageService.set("addresses", addresses);
                $scope.addresses = addresses;
                $scope.addressStatus = 'success';

                $scope.loadAddresses();
            } else {
                $scope.addressStatus = data.error;
            }
        });
    }

    $scope.removeAddress = function(index) {
        var addresses = $scope.addresses;
        if (index > -1) {
            addresses.splice(index, 1);
        }
        localStorageService.set("addresses", addresses);
        $scope.addresses = addresses;

        $scope.loadAddresses();
    }
    $scope.loadAddresses = function() {
        $scope.addresses_stats = [];
        $scope.addresses_currency = [];

        angular.forEach($scope.addresses, function(address, index) {
            if (address.currency == $scope.selected_pool.name) {
                $scope.addresses_currency.push(address);
                var pool = $filter('getByName')($scope.pools, address.currency);
                $http.get(pool.poolrpc + "stats_address?address=" + address.address, http_config).success(function(data, status) {
                    $scope.createChart('configChartsHashrate', 'Hashrate');
                    $scope.pushToChart(data.charts.hashrate, 'configChartsHashrate', 'toMicrotime', 'Hashrate', '', 0);
                    $scope.createChart('configChartsPayments', 'Payments');
                    $scope.pushToChart(data.charts.payments, 'configChartsPayments', 'toMicrotimeCoins', 'Payment', '', 0);
                    data.configCharts = [];
                    data.configCharts['hashrate'] = $scope.configChartsHashrate;
                    data.configCharts['payments'] = $scope.configChartsPayments;
                    data.real_index = index;
                    data.paymentsList = [];
                    data.last_printed_payment = 2000000000;
                    $scope.addresses_stats.push(data);
                });
            }
        });
    }


    $scope.parsePayment = function(time, serializedPayment) {
        var parts = serializedPayment.split(':');
        return {
            time: parseInt(time),
            hash: parts[0],
            amount: parts[1],
            fee: parts[2],
            mixin: parts[3],
            recipients: parts[4]
        };
    }

    $scope.sortPayments = function(index) {
        $scope.addresses_stats[index].paymentsList = $filter('unique')($scope.addresses_stats[index].paymentsList, 'time');
        $scope.addresses_stats[index].paymentsList = $filter('orderBy')($scope.addresses_stats[index].paymentsList, 'time', -1);

        $scope.addresses_stats[index].last_printed_payment = $scope.addresses_stats[index].paymentsList[$scope.addresses_stats[index].paymentsList.length - 1].time;
    }

    $scope.getPayments = function(timestamp, index) {
        var url = $scope.selected_pool.poolrpc + "get_payments?address=" + $scope.addresses_currency[index].address + "&time=" + timestamp;
        $http.get(url, http_config).success(function(data, status) {
            var raw_payments = data;
            for (var i = 0; i < raw_payments.length; i += 2) {
                var payment = $scope.parsePayment(raw_payments[i + 1], raw_payments[i]);
                $scope.addresses_stats[index].paymentsList.push(payment);
            }
            $scope.sortPayments(index);
        });
    }

    $scope.getData = function() {
        $http.get($scope.selected_pool.poolrpc + "stats").success(function(data, status) {
            $scope.data = data;

            if (!$scope.populatedCharts) {
                $scope.createChart('chartDifficultyConfig', 'Difficulty');
                $scope.pushToChart(data.charts.difficulty, 'chartDifficultyConfig', 'toMicrotime', 'Difficulty', '', 0);

                $scope.createChart('chartHashrateConfig', "Pool_Hashrate");
                $scope.pushToChart(data.charts.hashrate, 'chartHashrateConfig', 'toMicrotime', 'Hashrate', ' H/s', 2);

                if (data.charts.profit !== undefined && data.charts.profit.length != 0) {
                    $scope.createChart('chartHashUSDConfig', 'Hash/USD');
                    $scope.pushToChart(data.charts.profit, 'chartHashUSDConfig', 'toMicrotime', 'Profit', 'H/USD', 0);
                }

                if (data.charts.price !== undefined && data.charts.price.length != 0) {
                    $scope.createChart('chartPriceUSDConfig', 'Price in USD');
                    $scope.pushToChart(data.charts.price, 'chartPriceUSDConfig', 'toMicrotime', 'USD', '', 0);
                }
                $scope.populatedCharts = true;
            }
        });
    }

    $scope.getCryptonatorData = function(ticker) {
        $http.get("https://www.cryptonator.com/api/ticker/" + $scope.selected_pool.ticker.toUpperCase() + "-" + ticker.toUpperCase()).success(function(data, status) {
            $scope.cryptonator_data[data.ticker.target] = data.ticker.price;
            $scope.cryptonator_updated = data.timestamp;
            if (ticker == 'USD') {
                $scope.hashPerUSD = $scope.data.charts.profit[$scope.data.charts.profit.length-1][1];
            }
        });
    }

    $scope.calcEstimateProfit = function() {
        var rateUnit = Math.pow(1024, parseInt($scope.calcUnits));
        var hashRate = parseFloat($scope.calcHashRate * rateUnit);
        $scope.calcProfit = (hashRate * 86400 / $scope.data.network.difficulty) * $scope.data.network.reward;
    }

    $scope.setCalcUnits = function(calcUnits, calcUnitName) {
        $scope.calcUnits = calcUnits;
        $scope.calcUnitName = calcUnitName;
    }

    $scope.createChart = function(cf, t, data) {
        $scope[cf] = {
            options: {
                chart: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    height: 150,
                    zoomType: 'x'
                },
                rangeSelector: {
                    enabled: false
                },
                navigator: {
                    enabled: false
                },
                scrollbar: {
                    enabled: false
                },
                title: {
                    text: t
                },
                xAxis: {
                    visible: false
                },
                yAxis: {
                    visible:false,
                },
            },
            series: [],
            useHighStocks: true
        }
    };
    $scope.pushToChart = function(d, cf, f, n, vs, vd) {
        $scope[cf].series.push({
            name: n,
            data: d.map(window[f], d),
            tooltip: {
                valueSuffix: vs
            }
        });
        $scope[cf].loading = false;
    };

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
        $rootScope.window_title = $filter('capitalize')($scope.selected_pool.name) + " mining pool | Democats.org";
    });
    $scope.$watchCollection('[selected_pool, currencies]', function() {
        if ($scope.chatURL == '') {
            $scope.chatURL = $sce.trustAsResourceUrl('https://kiwiirc.com/client/irc.kiwiirc.com/?&theme=mini#' + $scope.selected_pool.name);
        }
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
        divider = $scope.coin_unit_fraction = Math.log10($scope.selected_pool_stats.coin_units);

        if ($scope.selected_pool !== undefined && $scope.currencies !== undefined && ($scope.height === undefined || $scope.height === null)) {
            $scope.getData();
        }
        $scope.getCryptonatorData('BTC');
        $scope.getCryptonatorData('USD');

        if ($scope.addresses_currency === undefined) {
            $scope.loadAddresses();
        }
    });
}]);



app.controller("PoolMiningCtl", ["$rootScope", "$scope", "$filter", "$http", "HeaderService", "poolsFactory", "poolsStatsFactory", function($rootScope, $scope, $filter, $http, HeaderService, poolsFactory, poolsStatsFactory) {
    $scope.currency_name = $filter('lowercase')(urlParam('name'));

    $scope.changeCurrency = function(o) {
        HeaderService.changeCurrency(o);
    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
        $rootScope.window_title = "How to mine " + $filter('capitalize')($scope.selected_pool.name) + " | Democats.org";
    });
    $scope.$watch('currencies', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
    });
}]);




app.controller("BlocksListCtl", ["$rootScope", "$scope", "$filter", "$http", "HeaderService", "poolsFactory", "poolsStatsFactory", "blockFactory", function($rootScope, $scope, $filter, $http, HeaderService, poolsFactory, poolsStatsFactory, blockFactory) {
    $scope.currency_name = $filter('lowercase')(urlParam('name'));

    $scope.changeCurrency = function(o) {
        HeaderService.changeCurrency(o);
    }

    $scope.getBlocks = function(height) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_blocks_list_json",
            params: {
                height: height
            }
        });

        $http.post($scope.selected_pool.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            $scope.blocks = data.result.blocks;
        });
    }

    $scope.changeHeight = function(height) {
        $scope.height = height;
        $scope.getBlocks(height);
        $scope.prev_block_1 = (height - 61 < 0) ? 0 : height - 61;
        $scope.prev_block_2 = (height - 31 < 0) ? 0 : height - 31;
        $scope.next_block_1 = (height + 1 > $scope.selected_pool_stats.height) ? $scope.selected_pool_stats.height : height + 1;
        $scope.next_block_2 = (height + 31 > $scope.selected_pool_stats.height) ? $scope.selected_pool_stats.height : height + 31;
    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
        $rootScope.window_title = $filter('capitalize')($scope.selected_pool.name) + " blockchain explorer | Democats.org";
    });
    $scope.$watch('currencies', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
        $scope.coin_unit_fraction = Math.log10($scope.selected_pool_stats.coin_units);

    });

    $scope.$watchCollection('[selected_pool, currencies]', function() {
        if ($scope.selected_pool !== undefined && $scope.currencies !== undefined && ($scope.height === undefined || $scope.height === null)) {
            $scope.coins_emitted = blockFactory.last($scope.selected_pool, $scope.selected_pool_stats).success(function(data, status) {
                $scope.coins_emitted = data.result.block.alreadyGeneratedCoins / $scope.selected_pool_stats.coin_units;
            });

            if (urlParam('height'))
                $scope.changeHeight(parseInt(urlParam('height')));
            else
                $scope.changeHeight($scope.selected_pool_stats.height);
        }

        if ($scope.height + 2 >= $scope.selected_pool_stats.height) {
            $scope.changeHeight($scope.selected_pool_stats.height);
        }
    });
}]);

app.controller("BlockDetailsCtl", ["$rootScope", "$scope", "$filter", "$http", "HeaderService", "poolsFactory", "poolsStatsFactory", "blockFactory", function($rootScope, $scope, $filter, $http, HeaderService, poolsFactory, poolsStatsFactory, blockFactory) {
    $scope.currency_name = $filter('lowercase')(urlParam('name'));
    $scope.hash = urlParam('hash');

    $scope.changeCurrency = function(o) {
        HeaderService.changeCurrency(o);
    }

    $scope.changeBlock = function(hash) {
        $scope.hash = hash;
        $scope.getBlock(hash);
    }

    $scope.getNextHashFromHeight = function(height) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "getblockheaderbyheight",
            params: {
                height: (height + 1)
            }
        });

        $http.post($scope.selected_pool.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            $scope.block.next_hash = data.result.block_header.hash;
        });
    }

    $scope.getBlock = function(hash) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_block_json",
            params: {
                hash: hash
            }
        });

        $http.post($scope.selected_pool.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            $scope.block = data.result.block;
            if ($scope.block.height != $scope.height)
                $scope.getNextHashFromHeight($scope.block.height);
        });

    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
        $rootScope.window_title = $filter('capitalize')($scope.selected_pool.name) + " block " + $scope.hash + " | Democats.org";
    });
    $scope.$watchCollection('[selected_pool, currencies]', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
        $scope.coin_unit_fraction = Math.log10($scope.selected_pool_stats.coin_units);

        if ($scope.selected_pool !== undefined && $scope.currencies !== undefined && ($scope.height === undefined || $scope.height === null)) {
            $scope.coins_emitted = blockFactory.last($scope.selected_pool, $scope.selected_pool_stats).success(function(data, status) {
                $scope.coins_emitted = data.result.block.alreadyGeneratedCoins / $scope.selected_pool_stats.coin_units;
            });
            $scope.height = $scope.selected_pool_stats.height;

            $scope.getBlock($scope.hash);
        }

        if ($scope.height + 2 >= $scope.selected_pool_stats.height) {
            $scope.height = $scope.selected_pool_stats.height;
        }
    });

}]);


app.controller("TransactionDetailsCtl", ["$rootScope", "$scope", "$filter", "$http", "HeaderService", "poolsFactory", "poolsStatsFactory", "blockFactory", function($rootScope, $scope, $filter, $http, HeaderService, poolsFactory, poolsStatsFactory, blockFactory) {
    $scope.currency_name = $filter('lowercase')(urlParam('name'));
    $scope.hash = urlParam('hash');

    $scope.changeCurrency = function(o) {
        HeaderService.changeCurrency(o);
    }

    $scope.getTransaction = function(hash) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_transaction_json",
            params: {
                hash: hash
            }
        });

        $http.post($scope.selected_pool.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            $scope.transaction = data.result;
        });

    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
        $rootScope.window_title = $filter('capitalize')($scope.selected_pool.name) + " transaction " + $scope.hash + " | Democats.org";
    });
    $scope.$watchCollection('[selected_pool, currencies]', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
        $scope.coin_unit_fraction = Math.log10($scope.selected_pool_stats.coin_units);

        if ($scope.selected_pool !== undefined && $scope.currencies !== undefined && ($scope.height === undefined || $scope.height === null)) {
            $scope.coins_emitted = blockFactory.last($scope.selected_pool, $scope.selected_pool_stats).success(function(data, status) {
                $scope.coins_emitted = data.result.block.alreadyGeneratedCoins / $scope.selected_pool_stats.coin_units;
            });
            $scope.height = $scope.selected_pool_stats.height;
            $scope.getTransaction($scope.hash);
        }
    });
}]);


app.controller("PoolBlocksCtl", ["$rootScope", "$scope", "$filter", "$http", "HeaderService", "poolsFactory", "poolsStatsFactory", "blockFactory", function($rootScope, $scope, $filter, $http, HeaderService, poolsFactory, poolsStatsFactory, blockFactory) {
    $scope.currency_name = $filter('lowercase')(urlParam('name'));
    $scope.blocks = [];

    $scope.changeCurrency = function(o) {
        HeaderService.changeCurrency(o);
    }

    $scope.parseBlock = function(height, serializedBlock) {
        var parts = serializedBlock.split(':');
        var block = {
            height: parseInt(height),
            hash: parts[0],
            timestamp: parts[1],
            difficulty: parseInt(parts[2]),
            shares: parseInt(parts[3]),
            orphaned: parts[4],
            reward: parts[5]
        };
        var toGo = $scope.selected_pool_stats.depth - ($scope.selected_pool_stats.height - block.height);
        block.maturity = toGo < 1 ? '' : (toGo + ' to go');
        switch (block.orphaned) {
            case '0':
                block.status = 'unlocked';
                break;
            case '1':
                block.status = 'orphaned';
                break;
            default:
                block.status = 'pending';
                break;
        }
        return block;
    }

    $scope.sortBlocks = function() {
        $scope.blocks = $filter('unique')($scope.blocks, 'height');
        $scope.blocks = $filter('orderBy')($scope.blocks, 'height', -1);

        $scope.last_found_block = $scope.blocks[0].height;
        $scope.last_printed_block = $scope.blocks[$scope.blocks.length - 1].height;
    }

    $scope.getInitialBlocks = function() {
        $http.get($scope.selected_pool.poolrpc + "stats", http_config).success(function(data, status) {
            var raw_blocks = data.pool.blocks;
            for (var i = 0; i < raw_blocks.length; i += 2) {
                var block = $scope.parseBlock(raw_blocks[i + 1], raw_blocks[i]);
                $scope.blocks.push(block);
            }
            $scope.sortBlocks();
        });
    }

    $scope.getBlocks = function(height) {
        $http.get($scope.selected_pool.poolrpc + "get_blocks?height=" + height, http_config).success(function(data, status) {
            var raw_blocks = data;

            for (var i = 0; i < raw_blocks.length; i += 2) {
                var block = $scope.parseBlock(raw_blocks[i + 1], raw_blocks[i]);
                $scope.blocks.push(block);
            }

            $scope.sortBlocks();
        });
    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
        $rootScope.window_title = $filter('capitalize')($scope.selected_pool.name) + " pool blocks | Democats.org";
    });
    $scope.$watchCollection('[selected_pool, currencies]', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
        $scope.coin_unit_fraction = Math.log10($scope.selected_pool_stats.coin_units);

        if ($scope.selected_pool !== undefined && $scope.currencies !== undefined && ($scope.height === undefined || $scope.height === null)) {
            if (urlParam('height')) {
                $scope.height = parseInt(urlParam('height'));
                $scope.getInitialBlocks();
            } else {
                $scope.height = $scope.selected_pool_stats.height;
                $scope.getInitialBlocks();
            }
        }

        if ($scope.height !== undefined && $scope.height + 2 >= $scope.selected_pool_stats.height) {
            $scope.height = $scope.selected_pool_stats.height;
            $scope.getInitialBlocks();
        }
    });
}]);


app.controller("SearchBlockchainCtl", ["$rootScope", "$scope", "$filter", "$http", "$window", "poolsFactory", "poolsStatsFactory", "blockFactory", function($rootScope, $scope, $filter, $http, $window, poolsFactory, poolsStatsFactory, blockFactory) {
    $scope.currency_name = $filter('lowercase')(urlParam('name'));

    $scope.getBlock = function(hash) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_block_json",
            params: {
                hash: hash
            }
        });

        $http.post($scope.selected_pool.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            if (data.result !== undefined)
                $window.location.href = '/blockchain/block/?name=' + $scope.currency_name + '&hash=' + hash;
        });

    }
    $scope.getTransaction = function(hash) {
        var data = JSON.stringify({
            jsonrpc: "2.0",
            id: "test",
            method: "f_transaction_json",
            params: {
                hash: hash
            }
        });

        $http.post($scope.selected_pool.daemonrpc + "json_rpc", data, http_config).success(function(data, status) {
            if (data.result !== undefined)
                $window.location.href = '/blockchain/transaction/?name=' + $scope.currency_name + '&hash=' + hash;

        });

    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
    });
    $scope.$watch('currencies', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
    });

    $scope.searchFor = function(search) {
        $scope.getBlock(search);
        $scope.getTransaction(search);
    }
}]);


app.controller("BlockchainChartsCtl", ["$scope", "$filter", "$http", "HeaderService", "poolsFactory", "poolsStatsFactory", function($scope, $filter, $http, HeaderService, poolsFactory, poolsStatsFactory) {
    $scope.currency_name = $filter('lowercase')(urlParam('name'));
    if (!$scope.period)
        $scope.period = '1d';
    $scope.chartsLoaded = false;


    $scope.changeCurrency = function(o) {
        HeaderService.changeCurrency(o);
    }
    $scope.createChart = function(cf, t) {
        $scope[cf] = {
            options: {
                chart: {
                    zoomType: 'x'
                },
                rangeSelector: {
                    buttons: [{
                        type: 'day',
                        count: 1,
                        text: '1d'
                    }, {
                        type: 'week',
                        count: 1,
                        text: '1w'
                    }, {
                        type: 'month',
                        count: 1,
                        text: '1m'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6m'
                    }, {
                        type: 'ytd',
                        text: 'YTD'
                    }, {
                        type: 'year',
                        count: 1,
                        text: '1y'
                    }, {
                        type: 'all',
                        text: 'All'
                    }],
                    selected: 2
                },
                navigator: {
                    enabled: true
                },
            },
            title: {
                text: t
            },
            series: [],
            loading: true,
            useHighStocks: true
        }
    };

    $scope.createColumnChart = function(cf, t) {
        $scope[cf] = {
            options: {
                chart: {
                    type: 'column'
                },
                navigator: {
                    enabled: false
                },
            },
            title: {
                text: t
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            xAxis: {
                type: 'datetime',
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Percentage (%)'
                }
            },
            series: [],
            loading: true
        }
    };

    $scope.pushToChart = function(c, ch, p, cf, f, n, vs, vd) {
        var domain = 'https://raw.githubusercontent.com/democatscharts/charts/master/';
        $http.get(domain + $filter('lowercase')(c) + '/' + ch + '_' + p + '.json')
            .then(function(res) {
                data = res.data;

                $scope[cf].series.push({
                    name: n,
                    data: data.map(window[f], data),
                    tooltip: {
                        valueDecimals: vd,
                        valueSuffix: vs
                    }
                });
                $scope[cf].loading = false;
                $scope.isDisabled = false;
            });
    };
    $scope.clearChart = function(cf) {
        $scope.isDisabled = true;
        $scope[cf].series = [];
        $scope[cf].loading = true;
    };
    $scope.redrawChart = function(cf) {
        $scope[cf].getHighcharts().xAxis[0].setExtremes(new Date(Date.now() + -30 * 24 * 3600 * 1000));
    };

    $scope.reloadChart = function(c, ch, p, cf, f, n, vs, vd) {
        $scope.clearChart(cf);
        $scope.pushToChart(c, ch, p, cf, f, n, vs, vd);
        $scope.redrawChart(cf);
    };

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
        $rootScope.window_title = $filter('capitalize')($scope.selected_pool.name) + " charts | Democats.org";
    });

    $scope.$watch('currencies', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
        divider = Math.log10($scope.selected_pool_stats.coin_units);
        if (!$scope.chartsLoaded) {
            $scope.loadCharts();
            $scope.chartsLoaded = true;
        }
    });

    $scope.loadCharts = function() {
        // Difficulty
        $scope.pushToChart($scope.currency_name, 'difficulty_avg', $scope.period, 'chartDifficultyConfig', 'toMicrotime', $filter('capitalize')($scope.currency_name) + ' Difficulty', '', 0);
        $scope.createChart('chartDifficultyConfig', 'Difficulty');

        // Hashrate
        $scope.pushToChart($scope.currency_name, 'hashrate', $scope.period, 'chartHashrateConfig', 'toMicrotime', $filter('capitalize')($scope.currency_name) + ' Hashrate', ' H/s', 2);
        $scope.createChart('chartHashrateConfig', 'Hashrate');

        // Generated coins
        $scope.pushToChart($scope.currency_name, 'generated_coins', $scope.period, 'chartGeneratedCoinsConfig', 'toMicrotimeCoins', $filter('capitalize')($scope.currency_name) + ' Generated coins', '', 0);
        $scope.createChart('chartGeneratedCoinsConfig', 'Generated coins');

        // Block reward
        $scope.pushToChart($scope.currency_name, 'block_reward', $scope.period, 'chartBlockRewardConfig', 'toMicrotimeCoins', $filter('capitalize')($scope.currency_name) + ' Block reward', '', 2);
        $scope.createChart('chartBlockRewardConfig', 'Block reward');

        // Transactions count
        $scope.pushToChart($scope.currency_name, 'transactions_count', $scope.period, 'chartTransactionsCountConfig', 'toMicrotime', $filter('capitalize')($scope.currency_name) + ' Transactions count', '', 0);
        $scope.createChart('chartTransactionsCountConfig', 'Transactions count');

        // Transactions fees
        $scope.pushToChart($scope.currency_name, 'transactions_fees', $scope.period, 'chartTransactionsFeesConfig', 'toMicrotimeCoins', $filter('capitalize')($scope.currency_name) + ' Transactions fees', '', 2);
        $scope.createChart('chartTransactionsFeesConfig', 'Transactions fees');

        // Transactions outputs
        $scope.pushToChart($scope.currency_name, 'transactions_outputs', $scope.period, 'chartTransactionsOutputsConfig', 'toMicrotimeCoins', $filter('capitalize')($scope.currency_name) + ' Transactions outputs (sum)', '', 2);
        $scope.createChart('chartTransactionsOutputsConfig', 'Transactions outputs (sum)');

        // Transactions size
        $scope.pushToChart($scope.currency_name, 'transactions_size_avg', $scope.period, 'chartTransactionsSizeConfig', 'toMicrotime', $filter('capitalize')($scope.currency_name) + ' Transactions size (avg)', 'bytes', 0);
        $scope.createChart('chartTransactionsSizeConfig', 'Transactions size (average)');

        // Transactions fusion count
        $scope.pushToChart($scope.currency_name, 'transactions_fusion_count', $scope.period, 'chartTransactionsFusionCountConfig', 'toMicrotime', $filter('capitalize')($scope.currency_name) + ' Fusion transactions count', '', 0);
        $scope.createChart('chartTransactionsFusionCountConfig', 'Fusion transactions count');

        // Current tx median
        $scope.pushToChart($scope.currency_name, 'block_current_txs_median_max', $scope.period, 'chartBlocksCurrentTxMedianConfig', 'toMicrotime', $filter('capitalize')($scope.currency_name) + ' Current tx median', ' bytes', 0);
        $scope.createChart('chartBlocksCurrentTxMedianConfig', 'Blocks current tx median (max)');

        // Blocks penalty percentage (avg)
        $scope.pushToChart($scope.currency_name, 'blocks_penalty_percentage', $scope.period, 'chartBlocksPenaltyPercentageConfig', 'toMicrotime', $filter('capitalize')($scope.currency_name) + ' Percentage of blocks with penalty', '%', 0);
        $scope.createChart('chartBlocksPenaltyPercentageConfig', 'Percentage of blocks with penalty');

        // Blocks size (avg)
        $scope.pushToChart($scope.currency_name, 'blocks_size_avg', $scope.period, 'chartBlocksSizeConfig', 'toMicrotime', $filter('capitalize')($scope.currency_name) + ' Blocks size (average)', ' bytes', 0);
        $scope.createChart('chartBlocksSizeConfig', 'Blocks size (average)');

        // Blocks time (avg)
        $scope.pushToChart($scope.currency_name, 'blocks_time_avg', $scope.period, 'chartBlocksTimeConfig', 'toMicrotime', $filter('capitalize')($scope.currency_name) + ' Blocks time (average)', ' s', 0);
        $scope.createChart('chartBlocksTimeConfig', 'Blocks time (average)');

        // Block version
        if ($scope.currency_name === "Quazarcoin") {
            $scope.pushToChart($scope.currency_name, 'version_1_1', '1h', 'chartBlockVersionsConfig', 'toMicrotime', 'Version 1.1', '%', 0);
            $scope.pushToChart($scope.currency_name, 'version_2_0', '1h', 'chartBlockVersionsConfig', 'toMicrotime', 'Version 2.0', '%', 0);
        } else {
            $scope.pushToChart($scope.currency_name, 'version_2_1', '1h', 'chartBlockVersionsConfig', 'toMicrotime', 'Version 2.1', '%', 0);
            $scope.pushToChart($scope.currency_name, 'version_3_0', '1h', 'chartBlockVersionsConfig', 'toMicrotime', 'Version 3.0', '%', 0);
        }
        $scope.createColumnChart('chartBlockVersionsConfig', 'Block version upgrade progress');
    }
}]);


app.filter('hashrateValue', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return 0;
        if (typeof precision === 'undefined') precision = 2;
        var units = ['H', 'kH', 'MH', 'GH', 'TH', 'PH'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));

        if (units[number] === undefined || units[number] === null) {
            return 0
        }
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision);
    }
});
app.filter('hashrateUnits', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return 'H';
        if (typeof precision === 'undefined') precision = 2;
        var units = ['H', 'kH', 'MH', 'GH', 'TH', 'PH'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));

        if (units[number] === undefined || units[number] === null) {
            return "H"
        }
        return units[number];
    }
});
app.filter('quantityValue', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return 0;
        if (typeof precision === 'undefined') precision = 0;
        var units = ['', 'k', 'M', 'G', 'T', 'P'],
            number = Math.floor(Math.log(bytes) / Math.log(1000));

        if (units[number] === undefined || units[number] === null) {
            return 0
        }
        return (bytes / Math.pow(1000, Math.floor(number))).toFixed(precision);
    }
});
app.filter('quantityUnits', function() {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '';
        if (typeof precision === 'undefined') precision = 0;
        var units = ['', 'k', 'M', 'G', 'T', 'P'],
            number = Math.floor(Math.log(bytes) / Math.log(1000));

        if (units[number] === undefined || units[number] === null) {
            return ""
        }
        return units[number];
    }
});
app.filter('getByTicker', function() {
    return function(input, ticker) {
        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (input[i].ticker == ticker) {
                return input[i];
            }
        }
        return null;
    }
});
app.filter('getByName', function() {
    return function(input, name) {
        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (input[i].name.toUpperCase() === name.toUpperCase()) {
                return input[i];
            }
        }
        return null;
    }
});
app.filter('getByCurrency', function() {
    return function(input, currency) {
        var i = 0,
            len = input.length;
        for (; i < len; i++) {
            if (input[i].currency.toUpperCase() === currency.toUpperCase()) {
                return input[i];
            }
        }
        return null;
    }
});
app.filter('asCoinUnits', function() {
    return function(input, coin_units) {
        return (input / coin_units);
    }
});
app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
});
app.filter('unique', function() {

    return function(items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {},
                newItems = [];

            var extractValueToCompare = function(item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function(item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});
// Fix for moment
app.filter('timeAgo', function() {
    return function(input) {
        return moment(input).fromNow();
    }
});
// End fix

app.config(function(localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('dashboard');
});

app.config(['$locationProvider', function($locationProvider) {

    $locationProvider.html5Mode(true);

}]);

function toMicrotime(data) {
    return [1000 * data[0], data[1]];
}

function toMicrotimeCoins(data) {
    return [1000 * data[0], data[1] / Math.pow(10, divider)];
}