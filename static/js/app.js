var http_config = {
    headers: {
        'Content-Type': undefined
    },
};
var divider = 0;


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


app.controller("MainCtl", ["$scope", "$filter", "poolsFactory", "poolsStatsFactory", function($scope, $filter, poolsFactory, poolsStatsFactory) {
    $scope.changeExamplePool = function(o) {
        $scope.selected_pool = o;
    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByTicker')($scope.pools, "DSH");
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


app.controller("DashboardCtl", ["$scope", "$filter", "$http", "localStorageService", "poolsFactory", "poolsStatsFactory", function($scope, $filter, $http, localStorageService, poolsFactory, poolsStatsFactory) {
    $scope.addresses = localStorageService.get("addresses") || [];
    $scope.addresses_stats = [];

    $scope.changePool = function(o) {
        $scope.selected_pool = o;
    }

    $scope.addAddress = function() {
        if (!$scope.selected_pool.name || !$scope.newAddress)
            return;
        var addresses = $scope.addresses;
        addresses.unshift({ currency: $scope.selected_pool.name, address: $scope.newAddress });
        addresses = $filter('unique')(addresses, ['address', 'currency']);

        $scope.addresses = addresses;
        localStorageService.set("addresses", $scope.addresses)

        $scope.addresses_stats.unshift({});
    }

    $scope.removeAddress = function(index) {
        var addresses = $scope.addresses;
        if (index > -1) {
            addresses.splice(index, 1);
        }
        $scope.addresses = addresses;
        localStorageService.set("addresses", $scope.addresses)

        if (index > -1) {
            $scope.addresses_stats.splice(index, 1);
        }
    }

    $scope.moveDownAddress = function(index) {
        var addresses = $scope.addresses;
        var tmp = addresses[index + 1];
        addresses[index + 1] = addresses[index];
        addresses[index] = tmp;
        $scope.addresses = addresses;
        localStorageService.set("addresses", $scope.addresses)

        tmp = $scope.addresses_stats[index + 1];
        $scope.addresses_stats[index + 1] = $scope.addresses_stats[index];
        $scope.addresses_stats[index] = tmp;
    }

    $scope.moveUpAddress = function(index) {
        var addresses = $scope.addresses;
        var tmp = addresses[index - 1];
        addresses[index - 1] = addresses[index];
        addresses[index] = tmp;
        $scope.addresses = addresses;
        localStorageService.set("addresses", $scope.addresses)

        tmp = $scope.addresses_stats[index - 1];
        $scope.addresses_stats[index - 1] = $scope.addresses_stats[index];
        $scope.addresses_stats[index] = tmp;

    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByTicker')($scope.pools, "DSH");
    });

    $scope.$watchCollection('[selected_pool, currencies]', function() {
        angular.forEach($scope.addresses, function(address, index) {
            var pool = $filter('getByName')($scope.pools, address.currency);

            $http.get(pool.poolrpc + "stats_address?address=" + address.address, http_config).success(function(data, status) {
                $scope.addresses_stats[index] = data;
            });
        });
    });
}]);


app.controller("BlockchainChartsCtl", ["$scope", "$filter", "$http", "HeaderService", "poolsFactory", "poolsStatsFactory", function($scope, $filter, $http, HeaderService, poolsFactory, poolsStatsFactory) {
    $scope.currency_name = $filter('lowercase')(urlParam('name'));

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
                enabled: true
            },
            scrollbar: {
                enabled: true
            }
        },
        series: [],
        title: {
            text: 'Hello'
        },
        useHighStocks: true
    }

    $scope.changeCurrency = function(o) {
      HeaderService.changeCurrency(o);
    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
        $rootScope.window_title = $filter('capitalize')($scope.selected_pool.name) + " charts | Democats.org";
    });

    $scope.$watch('currencies', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
        divider = Math.log10($scope.selected_pool_stats.coin_units);
    });

    $scope.loadCharts = function() {
  // Difficulty
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/difficulty_avg_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartDifficultyConfig.series.push({
              name : 'Difficulty',
              data: data.map(toMicrotime, data)
          });

      });

      $scope.chartDifficultyConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Difficulty'
          },
          series: [],
          useHighStocks: true
      }

  // Hashrate
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/hashrate_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartHashrateConfig.series.push({
              name : 'Hashrate',
              data: data.map(toMicrotime, data),
              tooltip: {
                  valueDecimals: 2,
                  valueSuffix: ' H/s'
              }
          });

      });

      $scope.chartHashrateConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Hashrate'
          },
          series : [],
          useHighStocks: true
      }

  // Generated coins
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/generated_coins_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartGeneratedCoinsConfig.series.push({
              name : 'Generated coins',
              data: data.map(toMicrotimeCoins, data)
          });

      });

      $scope.chartGeneratedCoinsConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Generated coins'
          },
          series: [],
          useHighStocks: true
      }

  // Block reward
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/block_reward_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartBlockRewardConfig.series.push({
              name : 'Block reward',
              data : data.map(toMicrotimeCoins, data),
              tooltip: {
                  valueDecimals: 2
              }
          });
      });

      $scope.chartBlockRewardConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Block reward'
          },
          series: [],
          useHighStocks: true
      }

  // Transactions count
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/transactions_count_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartTransactionsCountConfig.series.push({
              name : 'Transactions count',
              data: data.map(toMicrotime, data)
          });

      });

      $scope.chartTransactionsCountConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Transactions count'
          },
          series: [],
          useHighStocks: true
      }

  // Transactions fees
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/transactions_fees_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartTransactionsFeesConfig.series.push({
              name : 'Transactions fees',
              data : data.map(toMicrotimeCoins, data),
              tooltip: {
                  valueDecimals: 2
              }
          });

      });

      $scope.chartTransactionsFeesConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Transactions fees'
          },
          series: [],
          useHighStocks: true
      }

  // Transactions outputs
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/transactions_outputs_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartTransactionsOutputsConfig.series.push({
              name : 'Transactions outputs (sum)',
              data : data.map(toMicrotimeCoins, data),
              tooltip: {
                  valueDecimals: 2
              }
          });

      });

      $scope.chartTransactionsOutputsConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Transactions outputs (sum)'
          },
          series: [],
          useHighStocks: true
      }

  // Transactions size
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/transactions_size_avg_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartTransactionsSizeConfig.series.push({
              name : 'Transactions size (avg)',
              data: data.map(toMicrotime, data),
              tooltip: {
                  valueSuffix: ' bytes'
              }
          });

      });

      $scope.chartTransactionsSizeConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Transactions size (average)'
          },
          series: [],
          useHighStocks: true
      }

  // Transactions fusion count
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/transactions_fusion_count_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartTransactionsFusionCountConfig.series.push({
              name : 'Fusion transactions count',
              data: data.map(toMicrotime, data)
          });

      });

      $scope.chartTransactionsFusionCountConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Fusion transactions count'
          },
          series: [],
          useHighStocks: true
      }
  // Current tx median
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/block_current_txs_median_max_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartBlocksCurrentTxMedianConfig.series.push({
              name : 'Fusion transactions count',
              data: data.map(toMicrotime, data),
              tooltip: {
                  valueSuffix: ' bytes'
              }
          });

      });

      $scope.chartBlocksCurrentTxMedianConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Blocks current tx median (max)'
          },
          series: [],
          useHighStocks: true
      }

  // Blocks penalty percentage (avg)
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/blocks_penalty_percentage_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartBlocksPenaltyPercentageConfig.series.push({
              id: 1,
              data: data.map(toMicrotime, data),
              tooltip: {
                  valueSuffix: '%'
              }
          });

      });

      $scope.chartBlocksPenaltyPercentageConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Percentage of blocks with penalty'
          },
          series: [],
          useHighStocks: true
      }

  // Blocks size (avg)
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/blocks_size_avg_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartBlocksSizeConfig.series.push({
              id: 1,
              data: data.map(toMicrotime, data),
              tooltip: {
                  valueSuffix: ' bytes'
              }
          });

      });

      $scope.chartBlocksSizeConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Blocks size (average)'
          },
          series: [],
          useHighStocks: true
      }

  // Blocks time (avg)
      $http.get('https://raw.githubusercontent.com/democatscharts/charts/master/' + $scope.currency_name + '/blocks_time_avg_1d.json')
         .then(function(res){
            data = res.data;

          $scope.chartBlocksTimeConfig.series.push({
              id: 1,
              data: data.map(toMicrotime, data),
              tooltip: {
                  valueSuffix: ' s'
              }
          });

      });

      $scope.chartBlocksTimeConfig = {
          options: {
              chart: {
                  zoomType: 'x'
              },
              rangeSelector: {
                  enabled: true
              },
              navigator: {
                  enabled: true
              }
          },
          title: {
              text: 'Blocks time (average)'
          },
          series: [],
          useHighStocks: true
      }
    }
        $scope.loadCharts();
}]);


app.controller("DashboardPaymentsCtl", ["$scope", "$filter", "$http", "poolsFactory", "poolsStatsFactory", function($scope, $filter, $http, poolsFactory, poolsStatsFactory) {
    $scope.currency_name = urlParam('currency');
    $scope.address = urlParam('address');
    $scope.payments = [];

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

    $scope.sortPayments = function() {
        $scope.payments = $filter('unique')($scope.payments, 'time');
        $scope.payments = $filter('orderBy')($scope.payments, 'time', -1);

        $scope.last_printed_payment = $scope.payments[$scope.payments.length - 1].time;
    }

    $scope.getPayments = function(timestamp) {
        var url = $scope.selected_pool.poolrpc + "get_payments?address=" + $scope.address + "&time=" + timestamp;
        $http.get(url, http_config).success(function(data, status) {
            var raw_payments = data;
            for (var i = 0; i < raw_payments.length; i += 2) {
                var payment = $scope.parsePayment(raw_payments[i + 1], raw_payments[i]);
                $scope.payments.push(payment);
            }
            $scope.sortPayments();
        });
    }

    $scope.$watch('pools', function() {
        $scope.selected_pool = $filter('getByName')($scope.pools, $scope.currency_name);
    });
    $scope.$watchCollection('[selected_pool, currencies]', function() {
        $scope.selected_pool_stats = $filter('getByCurrency')($scope.currencies, $scope.currency_name);
        $scope.coin_unit_fraction = Math.log10($scope.selected_pool_stats.coin_units);
        if ($scope.selected_pool !== undefined && $scope.currencies !== undefined) {
            if ($scope.selected_pool_stats.height != $scope.height) {
                $scope.height = $scope.selected_pool_stats.height;
                $scope.getPayments(2000000000);
            }
        }
    });

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
  console.log(divider);
    return [1000 * data[0], data[1] / Math.pow(10, divider)];
}
