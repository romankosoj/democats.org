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
               <%= render 'pool-blocks-header' %>

        <div class="row">
            <highchart id="chart1" config="chartConfig" class="span6"></highchart>
        </div>

               <h1><span><span>{{currency_name | capitalize}}</span><span> </span><span>pool blocks</span></span></h1>

      </div>
   </div>
</div>

<script src="/js/scripts.js"></script>
<script src="/js/app.js"></script>