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
        </div>

        <div class="row">
            <highchart id="chart1" config="chartHashrateConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartGeneratedCoinsConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlockRewardConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsCountConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsFeesConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsOutputsConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsSizeConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartTransactionsFusionCountConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlocksCurrentTxMedianConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlocksPenaltyPercentageConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlocksSizeConfig" class="span6"></highchart>
        </div>
        <div class="row">
            <highchart id="chart1" config="chartBlocksTimeConfig" class="span6"></highchart>
        </div>


      </div>
   </div>
</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>