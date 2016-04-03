---
title: Cryptonote charts | Democats.org
description: 
keywords: 
layout: default
---

<div class="container" ng-controller="BlockchainChartsCtl">
   <noscript></noscript>
   <div class="main-app-container">
      <div class="container">
         <%= render 'blockchain-links' %>
         <section class="blockchain">
            <div>

               <h1><span><span><br />{{currency_name | capitalize}}</span><span> </span><span> charts</span></span></h1>
        <div class="row">
            <highchart id="chart1" config="chartDifficultyConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'difficulty_avg', '1h', 'chartDifficultyConfig', 'toMicrotime', selected_pool.name + ' Difficulty', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'difficulty_avg', '1d', 'chartDifficultyConfig', 'toMicrotime', pool.name + ' Difficulty', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>

        <div class="row">
            <highchart id="chart1" config="chartHashrateConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'hashrate', '1h', 'chartHashrateConfig', 'toMicrotime', selected_pool.name + ' Hashrate', ' H/s', 2)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'hashrate', '1d', 'chartHashrateConfig', 'toMicrotime', pool.name + ' Hashrate', ' H/s', 2)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartGeneratedCoinsConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'generated_coins', '1h', 'chartGeneratedCoinsConfig', 'toMicrotimeCoins', selected_pool.name + ' Generated coins', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'generated_coins', '1d', 'chartGeneratedCoinsConfig', 'toMicrotimeCoins', pool.name + ' Generated coins', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlockRewardConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'block_reward', '1h', 'chartBlockRewardConfig', 'toMicrotimeCoins', selected_pool.name + ' Block reward', '', 2)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'block_reward', '1d', 'chartBlockRewardConfig', 'toMicrotimeCoins', $pool.name + ' Block reward', '', 2)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsCountConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'transactions_count', '1h', 'chartTransactionsCountConfig', 'toMicrotime', selected_pool.name + ' Transactions count', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'transactions_count', '1d', 'chartTransactionsCountConfig', 'toMicrotime', pool.name + ' Transactions count', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsFeesConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'transactions_fees', '1h', 'chartTransactionsFeesConfig', 'toMicrotimeCoins', selected_pool.name + ' Transactions fees', '', 2)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'transactions_fees', '1d', 'chartTransactionsFeesConfig', 'toMicrotimeCoins', pool.name + ' Transactions fees', '', 2)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsOutputsConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'transactions_outputs', '1h', 'chartTransactionsOutputsConfig', 'toMicrotimeCoins', selected_pool.name + ' Transactions outputs (sum)', '', 2)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'transactions_outputs', '1d', 'chartTransactionsOutputsConfig', 'toMicrotimeCoins', pool.name + ' Transactions outputs (sum)', '', 2)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsSizeConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'transactions_size_avg', '1h', 'chartTransactionsSizeConfig', 'toMicrotime', selected_pool.name + ' Transactions size (avg)', 'bytes', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'transactions_size_avg', '1d', 'chartTransactionsSizeConfig', 'toMicrotime', pool.name + ' Transactions size (avg)', 'bytes', 0)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsFusionCountConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'transactions_fusion_count', '1h', 'chartTransactionsFusionCountConfig', 'toMicrotime', selected_pool.name + ' Fusion transactions count', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'transactions_fusion_count', '1d', 'chartTransactionsFusionCountConfig', 'toMicrotime', pool.name + ' Fusion transactions count', '', 0)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlocksCurrentTxMedianConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'block_current_txs_median_max', '1h', 'chartBlocksCurrentTxMedianConfig', 'toMicrotime', selected_pool.name + ' Current tx median', ' bytes', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'block_current_txs_median_max', '1d', 'chartBlocksCurrentTxMedianConfig', 'toMicrotime', pool.name + ' Current tx median', ' bytes', 0)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlocksPenaltyPercentageConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'blocks_penalty_percentage', '1h', 'chartBlocksPenaltyPercentageConfig', 'toMicrotime', selected_pool.name + ' Percentage of blocks with penalty', '%', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'blocks_penalty_percentage', '1d', 'chartBlocksPenaltyPercentageConfig', 'toMicrotime', pool.name + ' Percentage of blocks with penalty', '%', 0)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlocksSizeConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'blocks_size_avg', '1h', 'chartBlocksSizeConfig', 'toMicrotime', selected_pool.name + ' Blocks size (average)', ' bytes', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'blocks_size_avg', '1d', 'chartBlocksSizeConfig', 'toMicrotime', pool.name + ' Blocks size (average)', ' bytes', 0)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlocksTimeConfig" class="span6"></highchart>

            <div class="add-space pull-left"><button class="btn btn-default btn-sm" ng-click="reloadChart(currency_name, 'blocks_time_avg', '1h', 'chartBlocksTimeConfig', 'toMicrotime', selected_pool.name + ' Blocks time (average)', ' s', 0)" ng-disabled="isDisabled" ng-model="isDisabled">More details</button>
            </div>
            <div class="add-space pull-left">Compare with 
              <div class="btn-group rates">
               <button class="btn btn-default btn-sm dropdown-toggle" data-toggle="dropdown" tabindex="0"><span class="ng-binding">{{selected_pool.name}}</span><span class="caret"></span></button>
                 <ul class="dropdown-menu" role="menu">
                  <li ng-repeat="pool in pools | orderBy: 'name'" ng-if="pool.name!=selected_pool.name"><a class="dropdown-menu__entry" ng-click="pushToChart(pool.name, 'blocks_time_avg', '1d', 'chartBlocksTimeConfig', 'toMicrotime', pool.name + ' Blocks time (average)', ' s', 0)" ng-disabled="isDisabled" ng-model="isDisabled">{{pool.name}}</a></li>
                 </ul>
              </div>
            </div>
        </div>


      </div>
   </div>
</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>